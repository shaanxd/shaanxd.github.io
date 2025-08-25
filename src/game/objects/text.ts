import { Anchor, GameObj, TextCompOpt } from "kaplay";
import context from "../context";
import { DIALOG_BOX_TEXT_COLOR } from "../constants";

type TextOptions = {
  anchor: Anchor;
  textColor: string;
  shadowColor: string;
} & TextCompOpt;

const defaultOptions: TextOptions = {
  anchor: "top",
  align: "left",
  textColor: "#FFFFFF",
  shadowColor: DIALOG_BOX_TEXT_COLOR,
  font: "medodica",
};

class Text {
  // text: GameObj<TextComp | PosComp | ColorComp>;
  // shadow: GameObj<TextComp | PosComp | ColorComp>;

  static create(
    label: string,
    size: number,
    pos: [number, number] = [0, 0],
    options: Partial<TextOptions> = defaultOptions
  ) {
    const { anchor, textColor, shadowColor, ...rest } = {
      ...defaultOptions,
      ...options,
    };

    const [x, y] = pos;

    const getReusableParams = () => [
      context.text(label, {
        size,
        ...rest,
      }),
      context.anchor(anchor),
      context.area(),
    ];

    const text = context.make([
      ...getReusableParams(),
      context.pos(x, y),
      context.color(context.Color.fromHex(textColor)),
      context.z(10),
    ]);

    const shadow = context.make([
      ...getReusableParams(),
      context.pos(x + 5, y + 5),
      context.color(context.Color.fromHex(shadowColor)),
    ]);

    return [text as GameObj, shadow as GameObj];
  }
}

export default Text;
