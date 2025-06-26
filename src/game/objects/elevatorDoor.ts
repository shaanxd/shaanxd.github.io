import { GameObj } from "kaplay";
import context from "../context";
import { Point } from "../types";
import {
  ELEVATOR_DOOR_HEIGHT,
  ELEVATOR_DOOR_WIDTH,
  LayerOrder,
} from "../constants";
import { DoorAnimation, Layer } from "../enums";
import { overlapper } from "../components/overlapper";

interface ElevatorDoorState {
  open: boolean;
  animating: boolean;
  colliding?: boolean;
}

class ElevatorDoor {
  door: GameObj;
  state: ElevatorDoorState;

  constructor(point: Point, open: boolean) {
    this.state = {
      open,
      animating: false,
    };

    this.door = context.make([
      context.sprite("elevator_doors", { frame: open ? 8 : 0 }),
      context.body({
        isStatic: true,
      }),
      context.area({
        shape: new context.Rect(
          context.vec2(0, 0),
          ELEVATOR_DOOR_WIDTH,
          ELEVATOR_DOOR_HEIGHT
        ),
        collisionIgnore: open ? ["player"] : [],
      }),
      context.pos(point.x, point.y),
      context.anchor("botleft"),
      context.z(LayerOrder[Layer.Doors]),
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
          this.door.play(DoorAnimation.Open, {
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

          this.door.play(DoorAnimation.Closed, {
            onEnd: () => {
              this.door.collisionIgnore = [];
            },
          });
        }
      )
    );
  }
}

export default ElevatorDoor;
