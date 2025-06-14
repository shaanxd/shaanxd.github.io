import { Vec2 } from "kaplay";
import context from "../context";
import { VehicleAnimation } from "../enums";

class Vehicle {
  static create(pos: Vec2, dir: Vec2) {
    const rand = context.randi(1, 5);

    return context.make([
      context.sprite(`vehicle_${rand}`, { anim: VehicleAnimation.IdleSide }),
      context.area({
        shape: new context.Rect(context.vec2(0, -2.5), 5, 5),
      }),
      context.body(),
      context.pos(pos),
      context.move(dir, 100),
      context.z(1),
      "vehicle",
      context.offscreen({ destroy: true }),
    ]);
  }
}

export default Vehicle;
