import { AreaComp, GameObj, KEventController } from "kaplay";
import context from "../context";

function cursor() {
  let obj: GameObj<AreaComp>;
  let evt: KEventController;

  return {
    id: "cursor",

    add() {
      obj = this as unknown as GameObj<AreaComp>;

      obj.onHoverUpdate(() => {
        context.setCursor("pointer");
      });

      evt = context.onUpdate(this.default);
    },

    default() {
      if (context.getCursor() === "default") {
        return;
      }
      context.setCursor("default");
    },

    destroy() {
      if (obj.isHovering()) {
        this.default();
      }
      evt.cancel();
    },
  };
}

export default cursor;
