import context from "../context";
import { Emotes, PlayerAnimation, Scene } from "../enums";
import Player from "../objects/player";
import { getSpriteScale } from "../utils/sprite";
import { getCameraPositionWithBounds } from "../utils/camera";
import { setUrlSearchParam } from "../utils/url";
import AnimatedItem from "../objects/animatedItem";
import Character from "../objects/character";

const landing = async () => {
  setUrlSearchParam("scene", Scene.Landing);

  let scale = await getSpriteScale("landing");

  const data = await (await fetch("./maps/landing.json")).json();

  /** Initialize map object */
  const map = context.add([
    context.sprite("landing"),
    context.pos(0, 0),
    context.scale(scale),
  ]);

  const player = new Player(scale, undefined, true, true);
  map.add(player.character);
  player.emote(Emotes.Heart, false);

  for (const layer of data.layers) {
    switch (layer.name) {
      case "spawnpoints": {
        const location = layer.objects?.[0];
        player.character.pos = context.vec2(location.x, location.y);
        break;
      }
      case "items": {
        for (const point of layer.objects) {
          const item = AnimatedItem.create(point);
          map.add(item);
        }
        break;
      }
      case "boundaries": {
        break;
      }
      case "interactables": {
        break;
      }
      case "doors": {
        break;
      }
      case "characters": {
        for (const point of layer.objects) {
          const character = Character.create(point, PlayerAnimation.SitRight);
          map.add(character);
        }
        break;
      }
    }
  }

  const camera = context.onUpdate("player", () => {
    getCameraPositionWithBounds(map, player, scale, true);
  });

  context.onResize(async () => {
    scale = await getSpriteScale("landing");
    map.scale = context.vec2(scale, scale);
    player.setScale(scale);
  });

  context.onSceneLeave(() => {
    camera.cancel();
  });
};

export default landing;
