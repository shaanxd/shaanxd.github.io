import { ArrowOffset, DOOR_HEIGHT, LayerOrder } from "../constants";
import context from "../context";
import { Arrows, Layer } from "../enums";
import { Point } from "../types";

class Arrow {
  static create(point: Point, type: Arrows) {
    return context.make([
      context.pos(
        point.x + point.width / 2 - 7.5,
        point.y - DOOR_HEIGHT - (ArrowOffset[point.name!] || 0)
      ),
      context.sprite("arrows", { anim: type }),
      context.z(LayerOrder[Layer.Arrows]),
      "arrow",
    ]);
  }
}

export default Arrow;
