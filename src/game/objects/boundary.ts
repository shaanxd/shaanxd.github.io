import { Point } from "../types";
import context from "../context";

class Boundary {
  static create(point: Point) {
    return context.make([
      context.area({
        shape: new context.Rect(context.vec2(0), point.width, point.height),
      }),
      context.body({
        isStatic: true,
      }),
      context.pos(point.x, point.y),
      "boundary",
      point.name,
    ]);
  }
}

export default Boundary;
