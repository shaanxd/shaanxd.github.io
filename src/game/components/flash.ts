import { GameObj } from "kaplay";
import context from "../context";

export function flash(speed = 1) {
  let _flashTime = 0;

  return {
    id: "flash",
    add() {},
    update() {
      _flashTime += context.dt() * speed;
      // Opacity oscillates between 0.3 and 1
      const obj = this as unknown as GameObj;
      obj.opacity = 0.1 + 0.9 * (0.5 + 0.5 * Math.sin(_flashTime * Math.PI));
    },
  };
}
