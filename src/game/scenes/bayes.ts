import context from "../context";
import Boundary from "../objects/boundary";
import Player from "../objects/player";
import UI from "../objects/ui";
import { getSpriteScale } from "../utils/sprite";
import { PlayerSpawn, Scene } from "../enums";
import { Point } from "../types";
import Door from "../objects/door";
import ElevatorDoor from "../objects/elevatorDoor";
import layering from "../controls/layering";
import { SceneSpawnMap } from "../constants";

const bayes = (floor: Scene.Third | Scene.Fourth) => async () => {
  const floorParam = floor.toLowerCase();

  const scale = await getSpriteScale(floorParam, "width");

  const data = await (await fetch(`./maps/${floorParam}.json`)).json();

  /** Initialize map object */
  const map = context.add([
    context.sprite(floorParam),
    context.pos(0, 0),
    context.scale(scale),
  ]);

  const player = new Player(scale, context.vec2(0, -1));
  map.add(player.character);

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
        const location = layer.objects.find(
          (point: Point) => PlayerSpawn.PlayerBayes === point.name
        );
        player.character.pos = context.vec2(location.x, location.y);
        break;
      }
      case "doors": {
        for (const point of layer.objects) {
          const door = point.name.includes("elevator")
            ? new ElevatorDoor(point, false)
            : new Door(point, false, false);

          door.door.use(layering(player.character));
          door.onCollide(player.hitbox);

          map.add(door.door);
        }
        break;
      }
      case "interactables": {
        for (const point of layer.objects) {
          const interactable = Boundary.create(point);
          map.add(interactable);

          if (!point.name) {
            continue;
          }
          if (point.name.includes("entrance") && SceneSpawnMap[point.name]) {
            interactable.onCollide("player", () => {
              context.go(SceneSpawnMap[point.name]);
            });
          }
          break;
        }
      }
    }
  }

  const camera = context.onUpdate("player", () => {
    const left = window.innerWidth / 2;
    const right = map.width * scale - left;

    const playerPosX = player.character.pos.x * scale;

    const top = window.innerHeight / 2;
    const bottom = map.height * scale - top;

    const playerPosY = player.character.pos.y * scale;

    const x = Math.max(left, Math.min(playerPosX, right));
    const y = Math.max(top, Math.min(playerPosY, bottom));

    context.camPos(context.vec2(x, y));
  });

  context.onSceneLeave(() => {
    ui.destroy();
    camera.cancel();
  });
};

export default bayes;
