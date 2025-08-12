import context from "../context";
import { Point } from "../types";

class AnimatedItem {
  static create(point: Point) {
    return context.make([
      context.pos(point.x, point.y),
      context.sprite(point.name!, { anim: point.name }),
      "animated-item",
    ]);
  }
}

export default AnimatedItem;
