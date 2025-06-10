import { GameObj } from "kaplay";
import { SceneSpawnMap } from "../constants";
import context from "../context";
import { Interactable, NPCAnimation, PlayerSpawn } from "../enums";
import Boundary from "../objects/boundary";
import NPC from "../objects/npc";
import Player from "../objects/player";
import { Point } from "../types";
import { getSpriteScale } from "../utils/sprite";
import Vehicle from "../objects/vehicle";

const spawn = (point: Point, map: GameObj) => {
  const isHeadingRight = point.name === "vehicle-spawn-left";

  const pointX = isHeadingRight ? point.x - 50 : point.x + 50;

  const vehicle = new Vehicle(
    context.vec2(pointX, point.y),
    isHeadingRight ? context.RIGHT : context.LEFT
  );

  if (!isHeadingRight) {
    vehicle.sprite.flipX = true;
  }

  map.add(vehicle.sprite);

  context.wait(context.randi(3, 7), () => {
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

  const player = new Player(scale);

  balcony.add(player.character);

  for (const layer of data.layers) {
    switch (layer.name) {
      case "boundaries": {
        for (const point of layer.objects) {
          map.add(new Boundary(point).sprite);
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

            map.add(new NPC(count, animation, point).sprite);

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
          const interactable = new Boundary(point);
          map.add(interactable.sprite);

          if (point.name) {
            interactable.sprite.onCollide("player", () => {
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

  context.onUpdate("player", () => {
    const left = window.innerWidth / 2;
    const right = map.width * scale - window.innerWidth / 2;

    const playerPosX = player.character.pos.x * scale;

    const x = Math.max(left, Math.min(playerPosX, right));
    const y = map.height * scale - window.innerHeight / 2;

    context.camPos(context.vec2(x, y));
  });
};

export default balcony;
