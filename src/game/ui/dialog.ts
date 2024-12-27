import { GameObj, TimerController } from "kaplay";
import { CharactersPortait, PIXELS_PER_TILE } from "../constants";
import context from "../context";
import { Character, PortraitAnimation } from "../enums";
import { toTitleCase } from "../utils/text";
import { isMobile } from "../utils/screen";
import { Dialog, DialogParams } from "../types";

export const DIALOG_BOX_TEXT_COLOR = "#66522f";
export const DIALOG_BOX_MAX_WIDTH = 1200;
export const DIALOG_BOX_HEIGHT = PIXELS_PER_TILE * 4;
export const DIALOG_BOX_TEXT_SPEED = 0.02;
export const DIALOG_BOX_OPTIONS_HEIGHT = 8;
export const UI_SCALE = 3;
export const FONT_SIZE = 3;

const render = (container: GameObj, line: string) => {
  return line.split("").map((letter, idx) =>
    context.wait(DIALOG_BOX_TEXT_SPEED * idx, () => {
      container.text += letter;
    })
  );
};

export const createDialogBox = (
  character: `${Character}`,
  lines: Dialog[],
  onClose: () => void,
  params: DialogParams
) => {
  const width = Math.min(window.innerWidth, DIALOG_BOX_MAX_WIDTH);

  /** Round it off to something that is divisible by PIXEL_PER_TILE */
  const actualWidth =
    Math.round(width / UI_SCALE / PIXELS_PER_TILE) * PIXELS_PER_TILE;

  /** Make Dialog UI container with scaled width */
  const container = context.make([
    context.rect(actualWidth, DIALOG_BOX_HEIGHT, { fill: false }),
    context.pos(
      /** Place it center width */
      window.innerWidth / 2 - (actualWidth * UI_SCALE) / 2,
      /** Place it at X where X is bottom */
      window.innerHeight - DIALOG_BOX_HEIGHT * UI_SCALE
    ),
    context.scale(context.vec2(UI_SCALE)),
    context.fixed(),
    context.z(100),
    context.area(),
  ]);

  const tiles = Math.round(actualWidth / PIXELS_PER_TILE) - 1;

  for (let i = 0; i <= tiles; i++) {
    container.add([
      context.sprite("dialog-box", {
        frame: i === 0 ? 0 : i === tiles ? 2 : 1,
      }),
      context.pos(i * PIXELS_PER_TILE, 0),
    ]);
  }

  context.add(container);

  let dialogXPosition = PIXELS_PER_TILE;
  let dialogWidth = (tiles - 1) * PIXELS_PER_TILE;

  if (!isMobile()) {
    const portrait = container.add([
      context.sprite("dialog-box-portrait", { frame: 0 }),
      context.pos(PIXELS_PER_TILE * 1.5, PIXELS_PER_TILE / 2),
    ]);

    portrait.add([
      context.sprite(CharactersPortait[character], {
        anim: PortraitAnimation.Idle,
      }),
      /** Place it at the center of Portrait Container */
      context.pos(portrait.width / 2, portrait.height / 2),
      context.anchor("center"),
    ]);

    const nameContainer = portrait.add([
      context.sprite("dialog-box-name-tag", { frame: 0 }),
      context.pos(portrait.width / 2, portrait.height),
      context.anchor("center"),
    ]);

    dialogXPosition =
      nameContainer.pos.x + nameContainer.width - PIXELS_PER_TILE;
    dialogWidth = dialogWidth - nameContainer.width + PIXELS_PER_TILE;

    const name = nameContainer.add([
      context.text("", { font: "medodica", size: FONT_SIZE * UI_SCALE }),
      context.color(context.Color.fromHex(DIALOG_BOX_TEXT_COLOR)),
      context.anchor("center"),
    ]);

    /** Display Character Name */
    render(name, toTitleCase(character));
  }

  const dialogContainer = container.add([
    context.rect(
      /** Left and right padding of 6 Tiles combinedw */
      dialogWidth,
      /** Top and bottom padding of PIXELS_PER_TITLE each */
      DIALOG_BOX_HEIGHT / 4,
      {
        fill: false,
      }
    ),
    context.pos(dialogXPosition, PIXELS_PER_TILE),
  ]);

  const dialogText = dialogContainer.add([
    context.text("", {
      font: "medodica",
      size: FONT_SIZE * UI_SCALE,
      width: dialogContainer.width,
    }),
    context.color(context.Color.fromHex(DIALOG_BOX_TEXT_COLOR)),
  ]);

  /** Current dialog index */
  let idx = 0;

  const close = container.add([
    context.sprite("icons", { frame: 0 }),
    context.pos(actualWidth - PIXELS_PER_TILE * 1.75, PIXELS_PER_TILE * 0.75),
    context.area(),
  ]);

  close.onClick(() => {
    container.destroy();
  });

  let options: GameObj;

  let timers: TimerController[];

  const talk = () => {
    const current = lines[idx];

    if (current) {
      dialogText.text = "";
      options?.destroy();
      timers = render(dialogText, current.line);
      if (current.options) {
        options = container.add([
          context.rect(
            /** Left and right padding of 6 Tiles combinedw */
            dialogWidth,
            /** Top and bottom padding of PIXELS_PER_TITLE each */
            DIALOG_BOX_HEIGHT / 4,
            {
              fill: false,
            }
          ),
          context.pos(dialogXPosition, PIXELS_PER_TILE * 2 - 2),
        ]);

        current.options.forEach((value, index) => {
          const option = options.add([
            context.rect(
              /** Left and right padding of 6 Tiles combinedw */
              dialogWidth,
              /** Top and bottom padding of PIXELS_PER_TITLE each */
              DIALOG_BOX_OPTIONS_HEIGHT,
              {
                fill: false,
              }
            ),
            context.area(),
            context.scale(1),
            context.pos(0, DIALOG_BOX_OPTIONS_HEIGHT * index),
          ]);

          const label = option.add([
            context.text(value.type, {
              font: "medodica",
              size: FONT_SIZE * UI_SCALE,
              width: dialogContainer.width,
            }),
            context.area(),
            context.color(context.Color.fromHex(DIALOG_BOX_TEXT_COLOR)),
            context.pos(0, 0),
          ]);

          option.onHover(() => {
            label.moveTo(context.vec2(5, 0));
          });
          option.onHoverEnd(() => {
            label.moveTo(context.vec2(0, 0));
          });

          option.onHoverUpdate(() => {
            context.setCursor("pointer");
          });

          context.onUpdate(() => {
            context.setCursor("default");
          });

          option.onClick(() => {
            if (value.type === "Yes") {
              value.onClick?.(params);
            } else {
              container.destroy();
            }
            idx += 1;
            talk();
          });
        });
      }
    } else {
      container.destroy();
    }
  };

  talk();

  container.onKeyPress("space", () => {
    timers?.forEach((timer) => timer.cancel());
    idx += 1;

    talk();
  });

  /** Callback onDestroy */
  container.onDestroy(() => {
    onClose();
  });
};
