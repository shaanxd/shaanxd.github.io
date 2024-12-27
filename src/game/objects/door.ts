import { GameObj } from "kaplay";
import context from "../context";
import { Point } from "../types";
import { DOOR_HEIGHT, DOOR_WIDTH, LayerOrder } from "../constants";
import { DoorAnimation, Layer } from "../enums";
import { overlapper } from "../components/overlapper";

interface DoorState {
  open: boolean;
  animating: boolean;
  colliding?: boolean;
  vertical: boolean;
}

class Door {
  door: GameObj;
  state: DoorState;

  constructor(point: Point, open: boolean, vertical: boolean) {
    this.state = {
      open,
      animating: false,
      vertical,
    };

    this.door = context.make([
      context.sprite("doors", { frame: open || vertical ? 4 : 0 }),
      context.body({
        isStatic: true,
      }),
      context.area({
        shape: new context.Rect(context.vec2(0, 0), DOOR_WIDTH, DOOR_HEIGHT),
        collisionIgnore: open ? ["player"] : [],
      }),
      context.pos(point.x, point.y),
      context.anchor("botleft"),
      context.z(LayerOrder[vertical ? Layer.VerticalDoors : Layer.Doors]),
      "door",
    ]);
  }

  onCollide(object: GameObj) {
    this.door.use(
      overlapper(
        object,
        () => {
          if (this.state.open) {
            return;
          }
          this.state.open = true;
          const anim = this.state.vertical
            ? DoorAnimation.Closed
            : DoorAnimation.Open;
          this.door.play(anim, {
            onEnd: () => {
              this.door.collisionIgnore = ["player"];
            },
          });
        },
        () => {
          if (!this.state.open) {
            return;
          }
          this.state.open = false;

          const animation = this.state.vertical
            ? DoorAnimation.Open
            : DoorAnimation.Closed;

          this.door.play(animation, {
            onEnd: () => {
              this.door.collisionIgnore = [];
            },
          });
        }
      )
    );
  }
}

export default Door;
