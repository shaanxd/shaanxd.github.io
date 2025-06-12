import { AreaComp, GameObj, PosComp, SpriteComp } from "kaplay";
import context from "../context";
import { PIXELS_PER_TILE } from "../constants";
import cursor from "../controls/cursor";

class Toggle {
  toggled: boolean;
  container: GameObj<SpriteComp | AreaComp | PosComp>;
  onChange: (value: boolean) => void;

  constructor(
    container: GameObj,
    toggled: boolean,
    onChange: (value: boolean) => void
  ) {
    this.toggled = toggled;

    this.container = container.add([
      context.sprite("toggles", { frame: toggled ? 1 : 0 }),
      context.pos(container.width - PIXELS_PER_TILE * 2, 1),
      context.area(),
      cursor(),
    ]);

    this.container.onClick(() => this.onClick());
    this.onChange = onChange;
  }

  onClick() {
    this.toggled = !this.toggled;

    this.container.use(
      context.sprite("toggles", { frame: this.toggled ? 1 : 0 })
    );
    this.onChange(this.toggled);
  }
}

export default Toggle;
