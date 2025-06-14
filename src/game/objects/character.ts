import { Point } from "../types";
import context from "../context";
import { PlayerAnimation } from "../enums";
import { CHARACTER_WIDTH } from "../constants";

class Character {
  static create(point: Point) {
    return context.make([
      context.sprite(point.name!, { anim: PlayerAnimation.IdleDown }),
      context.area({
        shape: new context.Rect(context.vec2(0, 0), CHARACTER_WIDTH, 5),
      }),
      context.body({
        isStatic: true,
      }),
      context.anchor("bot"),
      context.pos(point.x, point.y),
      "character",
    ]);
  }
}

export default Character;
