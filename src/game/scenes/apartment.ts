import {
  DoorSpawnMapping,
  EnabledDoors,
  SceneSpawnMap,
  VerticalDoors,
} from "../constants";
import context from "../context";
import layering from "../controls/layering";
import {
  Animal as AnimalType,
  Character as CharacterType,
  Interactable,
  Interaction,
  PlayerSpawn,
} from "../enums";
import dialog from "../dialog";
import Animal from "../objects/animal";
import Door from "../objects/door";
import Player from "../objects/player";
import UI from "../objects/ui";
import { Point } from "../types";
import { createDialogBox } from "../ui/dialog";
import { getSpriteScale } from "../utils/sprite";
import StateService from "../state";
import Character from "../objects/character";
import Boundary from "../objects/boundary";

type ApartmentParams = {
  spawn: PlayerSpawn;
};

const DEFAULT_APARTMENT_PARAMS: ApartmentParams = {
  spawn: PlayerSpawn.PlayerApartment,
};

const apartment = async ({
  spawn,
}: ApartmentParams = DEFAULT_APARTMENT_PARAMS) => {
  const scale = await getSpriteScale("apartment");

  const data = await (await fetch("./maps/apartment.json")).json();

  /** Initialize map object */
  const map = context.add([
    context.sprite("apartment"),
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
      case "interactables": {
        for (const point of layer.objects) {
          const interactable = Boundary.create(point);
          map.add(interactable);

          if (!point.name) {
            continue;
          }
          if (point.name === Interactable.BalconyEntrance) {
            interactable.onCollide("player", () => {
              context.go(SceneSpawnMap[point.name]);
            });
          }

          const interactableDialog = dialog[point.name];

          if (!interactableDialog) {
            continue;
          }

          interactable.onCollide("player", () => {
            player.state.isInDialog = true;
            createDialogBox(
              CharacterType.Shahid,
              interactableDialog,
              () => {
                player.state.isInDialog = false;
              },
              { player }
            );
          });
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
          const disabled = !EnabledDoors.includes(point.name);
          const open = spawn === DoorSpawnMapping[point.name];
          const flipped = VerticalDoors.includes(point.name);
          const door = new Door(point, open, flipped);
          if (!disabled) {
            door.onCollide(player.hitbox);
          }
          map.add(door.door);
        }
        break;
      }
      case "characters": {
        for (const point of layer.objects) {
          if (point.name === "meow") {
            const animal = Animal.create(AnimalType.Cat, point);
            map.add(animal);

            continue;
          }
          const character = Character.create(point);
          character.use(layering(player.character));
          map.add(character);
        }
      }
    }
  }

  context.onUpdate("player", () => {
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

  context.onSceneLeave(() => ui.destroy());

  if (!StateService.get().introduced) {
    player.state.isInDialog = true;
    StateService.set({ introduced: true });

    // context.wait(0.5, () => {
    createDialogBox(
      CharacterType.Shahid,
      dialog[Interaction.Introduction],
      () => {
        player.state.isInDialog = false;
      },
      { player }
    );
    // });
  }
};

export default apartment;
