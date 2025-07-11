import {
  GameObj,
  PosComp,
  SpriteComp,
  TimerController,
  Vec2,
  Key,
  MouseButton,
} from "kaplay";

import {
  CHARACTER_HEIGHT,
  CHARACTER_WIDTH,
  IdleAnimations,
  LayerOrder,
  PLAYER_DEFAULT_SPEED,
} from "../constants";
import context from "../context";
import { Character, Layer, PlayerAnimation } from "../enums";

interface PlayerState {
  speed: number;
  direction: Vec2;
  outfit: number;
  isInDialog: boolean;
  isKeyboardMoving: boolean;
  isMouseMoving: boolean;
  isEmoting: boolean;
}

const DIAGONAL_FACTOR = 1 / Math.sqrt(2);

const PLAYER_DEFAULT_STATE: PlayerState = {
  speed: PLAYER_DEFAULT_SPEED,
  direction: context.vec2(0, 0),
  outfit: 1,
  isInDialog: false,
  isKeyboardMoving: false,
  isMouseMoving: false,
  isEmoting: false,
};

class Player {
  character: GameObj<SpriteComp | PosComp>;
  hitbox: GameObj;
  state: PlayerState;
  idleTimer: TimerController | undefined;
  scale: number;

  constructor(scale: number, direction?: Vec2) {
    this.scale = scale;
    this.state = PLAYER_DEFAULT_STATE;

    if (direction) {
      this.state.direction = direction;
    }

    this.character = this.sprite();
    this.hitbox = this.area();

    this.character.add(this.hitbox);

    (["a", "d", "w", "s"] as Key[]).forEach((key) => {
      this.character.onKeyDown(key, () => this.onKeyDown(key));
    });

    this.character.onKeyRelease((k) => this.onKeyRelease(k));
    this.character.onDestroy(() => this.onDestroy());
    this.character.onMouseDown((btn) => this.onMouseDown(btn));
    this.character.onMouseRelease((btn) => this.onMouseRelease(btn));

    this.idle();
    this.bore();
  }

  private sprite() {
    return context.make([
      context.sprite(`${Character.Shahid}-${this.state.outfit}`, {
        anim: PlayerAnimation.IdleDown,
      }),
      context.area({
        shape: new context.Rect(context.vec2(0, -2.5), 5, 5),
      }),
      context.body(),
      context.anchor("bot"),
      context.pos(),
      context.z(LayerOrder[Layer.Player]),
      "player",
    ]);
  }

  private area() {
    return context.make([
      context.rect(CHARACTER_WIDTH * 2, CHARACTER_HEIGHT * 2, {
        fill: false,
      }),
      context.pos(0, CHARACTER_HEIGHT / 2),
      context.area(),
      context.anchor("bot"),
      "player-hit-box",
    ]);
  }

  private onMouseDown(btn: MouseButton) {
    if (btn !== "left") {
      return;
    }
    const state = this.state;

    if (state.isInDialog || state.isKeyboardMoving) {
      return;
    }
    state.isMouseMoving = true;

    const worldMousePos = context.toWorld(context.mousePos());
    const scaledWorldMousePos = context.vec2(
      worldMousePos.x / this.scale,
      worldMousePos.y / this.scale
    );
    this.character.moveTo(scaledWorldMousePos, PLAYER_DEFAULT_SPEED);

    const angle = this.character.pos.angle(scaledWorldMousePos);

    const lowerBound = 50;
    const upperBound = 125;

    let animation;

    state.direction.x = 0;
    state.direction.y = 0;

    if (angle > lowerBound && angle < upperBound) {
      animation = PlayerAnimation.WalkUp;
      state.direction.y = -1;
    }

    if (angle < -lowerBound && angle > -upperBound) {
      animation = PlayerAnimation.WalkDown;
      state.direction.y = 1;
    }

    if (Math.abs(angle) > upperBound) {
      animation = PlayerAnimation.WalkSide;
      state.direction.x = 1;
      this.character.flipX = false;
    }

    if (Math.abs(angle) < lowerBound) {
      animation = PlayerAnimation.WalkSide;
      state.direction.x = -1;
      this.character.flipX = true;
    }

    if (animation && this.character.getCurAnim()?.name !== animation) {
      this.idleTimer?.cancel?.();
      this.character.play(animation);
    }
  }

  private onMouseRelease(btn: MouseButton) {
    if (btn !== "left") {
      return;
    }
    this.state.isMouseMoving = false;
    this.idle();
    this.bore();
  }

  private onKeyDown(key: string) {
    const state = this.state;

    if (state.isInDialog || state.isMouseMoving) {
      return;
    }

    state.direction.x = 0;
    state.direction.y = 0;

    switch (key) {
      case "a":
        state.direction.x = -1;
        break;
      case "d":
        state.direction.x = 1;
        break;
      case "w":
        state.direction.y = -1;
        break;
      case "s":
        state.direction.y = 1;
        break;
    }

    let animation;

    if (state.direction.eq(context.vec2(0, -1))) {
      animation = PlayerAnimation.WalkUp;
    }
    if (state.direction.eq(context.vec2(0, 1))) {
      animation = PlayerAnimation.WalkDown;
    }
    if (state.direction.eq(context.vec2(-1, 0))) {
      animation = PlayerAnimation.WalkSide;
      this.character.flipX = true;
    }
    if (state.direction.eq(context.vec2(1, 0))) {
      animation = PlayerAnimation.WalkSide;
      this.character.flipX = false;
    }

    const currentAnim = this.character.getCurAnim();

    const isPlayerWalkingAlready = [
      PlayerAnimation.WalkUp,
      PlayerAnimation.WalkDown,
      PlayerAnimation.WalkSide,
    ].includes(currentAnim?.name as PlayerAnimation);

    const isPlayerOnSameAnimation = currentAnim?.name === animation;

    if (animation && !isPlayerWalkingAlready && !isPlayerOnSameAnimation) {
      this.idleTimer?.cancel?.();
      this.character.play(animation);
    }
    if (state.direction.x && state.direction.y) {
      this.character.move(state.direction.scale(DIAGONAL_FACTOR * state.speed));
      return;
    }

    this.character.move(state.direction.scale(state.speed));
  }

  private onKeyRelease(key: Key) {
    if (!["d", "s", "w", "a"].includes(`${key}`)) {
      return;
    }

    this.state.isKeyboardMoving = false;

    this.idle();
    this.bore();
  }

  private onDestroy() {}

  idle() {
    let animation = PlayerAnimation.IdleDown;

    if (this.state.direction.eq(context.vec2(-1, 0))) {
      animation = PlayerAnimation.IdleSide;
      this.character.flipX = true;
    }
    if (this.state.direction.eq(context.vec2(1, 0))) {
      animation = PlayerAnimation.IdleSide;
      this.character.flipX = false;
    }
    if (this.state.direction.eq(context.vec2(0, -1))) {
      animation = PlayerAnimation.IdleUp;
    }

    this.character.play(animation);
  }

  bore() {
    this.idleTimer?.cancel?.();
    this.idleTimer = context.wait(10, () => {
      const animation = IdleAnimations[context.randi(IdleAnimations.length)];
      this.character.play(animation);
    });
  }

  change() {
    this.state.outfit += 1;

    if (this.state.outfit > 5) {
      this.state.outfit = 1;
    }

    const currentAnim = this.character.getCurAnim()?.name;

    this.character.use(
      context.sprite(`${Character.Shahid}-${this.state.outfit}`, {
        anim: currentAnim || PlayerAnimation.IdleDown,
      })
    );
  }

  stopAnim() {
    this.idle();
  }
}

export default Player;
