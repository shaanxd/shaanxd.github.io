import { flash } from "../components/flash";
import context from "../context";
import { Scene } from "../enums";
import Text from "./text";

const TITLE_X_PADDING = 25;
const TITLE_Y_PADDING = 100;
const TITLE_RELATIVE_TO_SCREEN = 10;
const TITLE_DEFAULT_SIZE = 120;

const getTitleMaxWidth = () =>
  Math.min(1500, window.innerWidth - TITLE_X_PADDING * 2);

const getBackdropWidth = (width: number) => width + 50;

const getTextSize = (min: number, div: number) =>
  Math.min(min, getTitleMaxWidth() / div);

class Title {
  static create() {
    const width = getTitleMaxWidth();

    const container = context.add([
      context.rect(width, 100, {
        // fill: false,
      }),
      context.pos(window.innerWidth / 2, TITLE_Y_PADDING),
      context.anchor("top"),
      context.fixed(),
      context.color(context.Color.BLACK),
      context.opacity(0.5),
    ]);

    const title = "A day in my life...";
    // Animate only the last three dots
    const dots = new Array(3).fill("").map((_, idx) => idx + title.length - 3);

    const [text, shadow] = Text.create(
      title,
      getTextSize(TITLE_DEFAULT_SIZE, TITLE_RELATIVE_TO_SCREEN),
      [0, 0],
      {
        textColor: "#FFC300",
        shadowColor: "#3B1C0A",
        font: "pixeloperator",
        transform: (idx, ch) => {
          const pos = context.vec2(0, 0);

          if (dots.includes(idx) && ch === ".") {
            // Each dot gets a unique random seed for playful bounce
            const phase = idx - dots[0];
            // Use a pseudo-random but deterministic offset for each dot
            const seed = 1234 + phase * 5678;
            // Use time plus seed for randomness
            const t = context.time() * (5 + (seed % 3) * 0.1) + seed;
            // Bounce only up, then return to original position
            // Use an ease-out cubic for playful bounce
            const bounce = Math.max(0, Math.sin(t) ** 3);
            // Randomize amplitude a bit for each dot
            const amplitude = 8 + (seed % 4);
            pos.y -= bounce * amplitude;
          }
          return { pos };
        },
      }
    );

    const [bottomText, bottomShadow] = Text.create(
      "By Shahid",
      30,
      [0, text.height + 20],
      {
        font: "pixeloperator",
        textColor: "#FFFFFF",
        shadowColor: "#3B1C0A",
      }
    );

    container.add(text);
    container.add(shadow);
    container.add(bottomText);
    container.add(bottomShadow);

    container.height = text.height + bottomText.height + 50;
    container.width = getBackdropWidth(text.width);

    const flashingContainer = context.add([
      context.rect(100, 10, { fill: true }),
      context.pos(window.innerWidth / 2, window.innerHeight - 100),
      context.anchor("center"),
      context.fixed(),
      context.color(context.Color.BLACK),
      context.opacity(0.5),
    ]);

    const flashingText = flashingContainer.add([
      context.text("Press Enter or Touch to Start", {
        font: "medodica",
        size: 30,
      }),
      context.area(),
      context.pos(0, 0),
      context.anchor("center"),
      context.z(10),
      flash(),
    ]);

    flashingContainer.width = flashingText.width + 20;
    flashingContainer.height = flashingText.height;

    context.onResize(() => {
      container.width = getTitleMaxWidth();
      container.pos.x = window.innerWidth / 2;

      const textSize = getTextSize(
        TITLE_DEFAULT_SIZE,
        TITLE_RELATIVE_TO_SCREEN
      );

      text.textSize = textSize;
      shadow.textSize = textSize;

      container.height = text.height + bottomText.height + 20;
      container.width = getBackdropWidth(text.width);

      flashingContainer.pos = context.vec2(
        window.innerWidth / 2,
        window.innerHeight - 100
      );
    });

    context.onTouchEnd(() => {
      context.go(Scene.Apartment);
    });
    context.onKeyPress("enter", () => {
      context.go(Scene.Apartment);
    });

    context.onSceneLeave(() => {
      container?.destroy?.();
    });
  }
}

export default Title;
