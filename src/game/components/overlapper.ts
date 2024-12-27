import { GameObj } from "kaplay";

export function overlapper(
  collider: GameObj,
  onEnter: () => void,
  onExit: () => void
) {
  let obj: GameObj;
  let wasOverlapping = false;

  return {
    id: "overlapper",
    add() {
      obj = this as unknown as GameObj;

      obj.onUpdate(() => {
        const isOverlapping = obj.isOverlapping(collider);

        if (isOverlapping === wasOverlapping) {
          return;
        }
        if (isOverlapping) {
          if (wasOverlapping) {
            return;
          }
          // Collider just entered the object boundary.
          onEnter();
          wasOverlapping = true;
          return;
        }
        if (wasOverlapping) {
          // Collider just exited the object boundary.
          onExit();
          wasOverlapping = false;
        }
      });
    },
  };
}
