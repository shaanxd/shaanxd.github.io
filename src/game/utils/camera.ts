import { GameObj } from "kaplay";
import context from "../context";
import Player from "../objects/player";
import { CAMERA_SPAN } from "../constants";

export const getCameraPositionWithBounds = (
  map: GameObj,
  player: Player,
  scale: number
) => {
  const camPos = context.camPos();

  const left = window.innerWidth / 2;
  const right = map.width * scale - left;

  const playerPosX = player.character.pos.x * scale;

  const top = window.innerHeight / 2;
  const bottom = map.height * scale - top;

  const playerPosY = player.character.pos.y * scale;

  const x = Math.max(left, Math.min(playerPosX, right));
  const y = Math.max(top, Math.min(playerPosY, bottom));

  context.camPos(
    context.vec2(
      context.lerp(camPos.x, x, CAMERA_SPAN),
      context.lerp(camPos.y, y, CAMERA_SPAN)
    )
  );
};
