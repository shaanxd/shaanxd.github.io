import { GameObj } from "kaplay";
import { SceneSpawnMap } from "../constants";
import context from "../context";
import { Interactable, NPCAnimation, PlayerSpawn } from "../enums";
import Player from "../objects/player";
import { Point } from "../types";
import { getSpriteScale } from "../utils/sprite";
import UI from "../objects/ui";
import NPC from "../objects/npc";
import Boundary from "../objects/boundary";
import Vehicle from "../objects/vehicle";
import { getCameraPositionWithBounds } from "../utils/camera";

const spawn = (point: Point, map: GameObj) => {
  const isHeadingRight = point.name === "vehicle-spawn-left";

  const pointX = isHeadingRight ? point.x - 50 : point.x + 50;

  const vehicle = Vehicle.create(
    context.vec2(pointX, point.y),
    isHeadingRight ? context.RIGHT : context.LEFT
  );

  if (!isHeadingRight) {
    vehicle.flipX = true;
  }

  map.add(vehicle);

  context.wait(context.randi(10, 20), () => {
    spawn(point, map);
  });
};

const balcony = async () => {
  const scale = await getSpriteScale("balcony-bg");

  const data = await (await fetch("./maps/balcony.json")).json();

  const map = context.add([
    context.sprite("balcony-bg"),
    context.pos(0, 0),
    context.scale(scale),
  ]);

  const balcony = context.add([
    context.sprite("balcony-fg"),
    context.pos(0, 0),
    context.scale(scale),
    context.z(2),
  ]);

  const player = new Player(scale, context.vec2(0, -1));
  balcony.add(player.character);

  const ui = new UI((isUiToggled: boolean) => {
    player.state.isInDialog = isUiToggled;
  });

  for (const layer of data.layers) {
    switch (layer.name) {
      case "boundaries": {
        for (const point of layer.objects) {
          map.add(Boundary.create(point));
        }
        break;
      }
      case "spawnpoints": {
        let count = 1;

        for (const point of layer.objects) {
          if (point.name.includes(PlayerSpawn.Player)) {
            player.character.pos = context.vec2(point.x, point.y);
          }
          if (point.name.includes("character-spawn")) {
            let animation = NPCAnimation.IdleDown;

            switch (point.name) {
              case "character-spawn-bench":
                animation = NPCAnimation.Read;
                break;
              case "character-spawn-balcony":
                animation = NPCAnimation.CheckPhone;
                break;
              case "character-spawn-talking-left":
                animation = NPCAnimation.IdleSide;
                break;
            }

            map.add(NPC.create(count, animation, point));

            count++;

            if (count > 4) {
              count = 1;
            }
          }
          if (point.name.includes("vehicle-spawn")) {
            spawn(point, map);
          }
        }
        break;
      }
      case "interactables": {
        for (const point of layer.objects) {
          const interactable = Boundary.create(point);
          map.add(interactable);

          if (point.name) {
            interactable.onCollide("player", () => {
              if (point.name === Interactable.ApartmentEntrance) {
                context.go(SceneSpawnMap[point.name], {
                  spawn: PlayerSpawn.PlayerBalcony,
                });
              } else {
                /** Implement dialog details */
              }
            });
          }
        }
        break;
      }
    }
  }

  let isCameraLoaded = false;

  const camera = context.onUpdate("player", () => {
    getCameraPositionWithBounds(map, player, scale, isCameraLoaded, () => {
      isCameraLoaded = true;
    });
  });

  context.onSceneLeave(() => {
    ui.destroy();
    camera.cancel();
  });
};

export default balcony;
