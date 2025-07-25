import { AnimalAnimation, Animal as AnimalType } from "../enums";
import context from "../context";
import { CHARACTER_WIDTH } from "../constants";
import { Point } from "../types";

class Animal {
  static create(type: `${AnimalType}`, point: Point) {
    return context.make([
      context.sprite(type, { anim: AnimalAnimation.Idle }),
      context.area({
        shape: new context.Rect(context.vec2(0, -5), CHARACTER_WIDTH, 10),
      }),
      context.body({
        isStatic: true,
      }),
      context.anchor("bot"),
      context.pos(point.x, point.y),
      "animal",
    ]);
  }
}

export default Animal;
