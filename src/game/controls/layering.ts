import { GameObj } from "kaplay";
import { LayerOrder } from "../constants";
import { Layer } from "../enums";

function layering(collider: GameObj) {
  let obj: GameObj;

  return {
    id: "layering",

    add() {
      obj = this as unknown as GameObj;

      obj.onUpdate(() => {
        const colliderYPos = collider.pos.y;
        const objYPos = obj.pos.y;

        let layering;

        if (colliderYPos < objYPos) {
          layering = LayerOrder[Layer.CharactersForeground];
        } else {
          layering = LayerOrder[Layer.CharactersBackground];
        }

        obj.z = layering;
      });
    },
  };
}

export default layering;
