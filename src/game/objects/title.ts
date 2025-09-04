import { flash } from "../components/flash";
import context from "../context";
import { Scene } from "../enums";

class Title {
  static create() {
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
      flashingContainer.pos = context.vec2(
        window.innerWidth / 2,
        window.innerHeight - 100
      );
    });

    context.onTouchEnd(this.leave);
    context.onClick(this.leave);
    context.onKeyPress("enter", this.leave);
  }

  static leave() {
    context.go(Scene.Apartment);
  }
}

export default Title;
