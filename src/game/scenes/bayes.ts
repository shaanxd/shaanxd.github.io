import context from "../context";
import Boundary from "../objects/boundary";
import Player from "../objects/player";
import UI from "../objects/ui";
import { getSpriteScale } from "../utils/sprite";
import { PlayerSpawn } from "../enums";
import { Point } from "../types";
import Door from "../objects/door";
import ElevatorDoor from "../objects/elevatorDoor";
import layering from "../controls/layering";

const bayes = async () => {
  const scale = await getSpriteScale("bayes", "width");

  const data = await (await fetch("./maps/bayes.json")).json();

  /** Initialize map object */
  const map = context.add([
    context.sprite("bayes"),
    context.pos(0, 0),
    context.scale(scale),
  ]);

  const player = new Player(scale);
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
