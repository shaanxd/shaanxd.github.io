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
import { getCameraPositionWithBounds } from "../utils/camera";
import { setUrlSearchParam } from "../utils/url";

type BayesParams = {
  spawn: PlayerSpawn;
};

const defaultParams: BayesParams = {
  spawn: PlayerSpawn.PlayerBayes,
};

const bayes =
  (floor: Scene.Third | Scene.Fourth) =>
  async ({ spawn }: BayesParams = defaultParams) => {
    setUrlSearchParam("scene", floor);
    const floorParam = floor.toLowerCase();

    let scale = await getSpriteScale(floorParam);

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
            (point: Point) => spawn === point.name
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
            const nextScene = SceneSpawnMap[point.name];
            if (point.name.includes("entrance") && nextScene) {
              const params = [Scene.Third, Scene.Fourth].includes(nextScene)
                ? { spawn: PlayerSpawn.PlayerBayesStairs }
                : { spawn: PlayerSpawn.PlayerApartmentWorld };
              interactable.onCollide("player", () => {
                context.go(SceneSpawnMap[point.name], params);
              });
            }
          }
        }
      }
    }

    let isCameraLoaded = false;

    const camera = context.onUpdate("player", () => {
      getCameraPositionWithBounds(map, player, scale, isCameraLoaded, () => {
        isCameraLoaded = true;
      });
    });

    context.onResize(async () => {
      scale = await getSpriteScale(floorParam);
      map.scale = context.vec2(scale, scale);
      player.setScale(scale);
    });

    context.onSceneLeave(() => {
      ui.destroy();
      camera.cancel();
    });

    context.onSceneLeave(() => {
      ui.destroy();
      camera.cancel();
    });
  };

export default bayes;
