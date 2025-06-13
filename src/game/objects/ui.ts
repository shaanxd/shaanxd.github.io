import { GameObj, SpriteData } from "kaplay";

import context from "../context";
import {
  DIALOG_BOX_TEXT_COLOR,
  FONT_SIZE,
  PIXELS_PER_TILE,
  UIText,
  UI_SCALE,
  UIButtonTileMap,
  CharactersPortait,
  SocialButtonTileMap,
  SocialLinkMap,
} from "../constants";
import {
  Locales,
  UILabels,
  UIButtonType,
  Character,
  PortraitAnimation,
  Socials,
} from "../enums";
import { getSpriteMetadata } from "../utils/sprite";
import { Point, TileMapJsonData } from "../types";
import Toggle from "./toggle";
import LocaleService from "../locales";
import cursor from "../controls/cursor";
import SoundService from "../sound";
import StateService from "../state";

export const FLAG_PIXEL_WIDTH = 15;
export const FLAG_PIXEL_HEIGHT = 10;
export const FLAG_PADDING = 3.5;
export const BUTTON_PADDING = 4;

class UI {
  ui: GameObj | undefined;

  settings: GameObj | undefined;
  isSettingsVisible: boolean = false;
  settingsSpriteData!: SpriteData;
  settingsJsonData!: TileMapJsonData;

  info: GameObj | undefined;
  isInfoVisible: boolean = false;
  infoSpriteData!: SpriteData;
  infoJsonData!: TileMapJsonData;

  onUiToggle: (_: boolean) => void;

  constructor(onUiToggle: (_: boolean) => void) {
    this.load();
    this.onUiToggle = onUiToggle;
  }

  async load() {
    this.settingsSpriteData = await getSpriteMetadata("settings");
    this.settingsJsonData = await (await fetch("./ui/settings.json")).json();

    this.infoSpriteData = await getSpriteMetadata("info");
    this.infoJsonData = await (await fetch("./ui/info.json")).json();

    this.createUi();
  }

  createUi() {
    this.ui?.destroy?.();

    const options = [
      { type: UIButtonType.Settings, onClick: () => this.toggleSettings() },
      { type: UIButtonType.Information, onClick: () => this.toggleInfo() },
    ];

    const buttonWidth = options.length * PIXELS_PER_TILE;
    const paddingWidth = (options.length + 1) * BUTTON_PADDING;

    const uiWidth = buttonWidth + paddingWidth;
    const uiHeight = PIXELS_PER_TILE + BUTTON_PADDING * 2;

    this.ui = context.add([
      context.rect(uiWidth, uiHeight, {
        fill: false,
      }),
      context.pos(PIXELS_PER_TILE, PIXELS_PER_TILE),
      context.area(),
      context.fixed(),
      context.scale(context.vec2(UI_SCALE)),
    ]);

    options.forEach((value, idx) => {
      const xPosition =
        idx * PIXELS_PER_TILE + BUTTON_PADDING + BUTTON_PADDING * idx;
      const yPosition = BUTTON_PADDING;

      const button = this.ui?.add([
        context.sprite("buttons", { frame: UIButtonTileMap[value.type] }),
        context.pos(xPosition, yPosition),
        context.anchor("topleft"),
        context.area(),
      ]);

      button?.onClick(value.onClick);
    });
  }

  toggleSettings() {
    if (this.isSettingsVisible) {
      this.settings?.destroy();
    } else {
      this.createSettings();
    }
    this.isSettingsVisible = !this.isSettingsVisible;
    this.onUiToggle(this.isSettingsVisible);
  }

  toggleInfo() {
    if (this.isInfoVisible) {
      this.info?.destroy();
    } else {
      this.createInfo();
    }
    this.isInfoVisible = !this.isInfoVisible;
    this.onUiToggle(this.isInfoVisible);
  }

  createSettings() {
    this.settings?.destroy?.();

    if (!this.settingsSpriteData || !this.settingsJsonData) {
      return;
    }

    const { width, height } = this.settingsSpriteData;
    const { layers } = this.settingsJsonData;

    this.settings = context.add([
      context.sprite("settings"),
      context.pos(
        window.innerWidth / 2 - (width * UI_SCALE) / 2,
        window.innerHeight / 2 - (height * UI_SCALE) / 2
      ),
      context.scale(context.vec2(UI_SCALE)),
      context.fixed(),
      context.z(100),
      context.area(),
    ]);

    this.settings.onKeyDown("escape", () => this.toggleSettings());

    for (const layer of layers) {
      if (!layer.objects) {
        continue;
      }
      for (const point of layer.objects) {
        switch (layer.name) {
          case "placements":
            switch (point.name) {
              case "flags": {
                this.createLocales(point);
                break;
              }
              case "buttons": {
                this.createButtons(point);
                break;
              }
              case "options": {
                this.createOptions(point);
                break;
              }
              default:
            }
            break;
          case "texts": {
            this.createTexts(this.settings, point);
            break;
          }
        }
      }
    }
  }

  createInfo() {
    this.info?.destroy?.();

    if (!this.infoSpriteData || !this.infoJsonData) {
      return;
    }

    const { width, height } = this.infoSpriteData;
    const { layers } = this.infoJsonData;

    this.info = context.add([
      context.sprite("info"),
      context.pos(
        window.innerWidth / 2 - (width * UI_SCALE) / 2,
        window.innerHeight / 2 - (height * UI_SCALE) / 2
      ),
      context.scale(context.vec2(UI_SCALE)),
      context.fixed(),
      context.z(100),
      context.area(),
    ]);

    this.info.onKeyDown("escape", () => this.toggleSettings());

    for (const layer of layers) {
      if (!layer.objects) {
        continue;
      }
      for (const point of layer.objects) {
        switch (layer.name) {
          case "placements":
            switch (point.name) {
              case "external-links": {
                this.createExternalLinks(point);
                break;
              }
              case "portrait": {
                this.createPortrait(point);
                break;
              }
              default:
            }
            break;
          case "texts": {
            if (point.name === UILabels.PersonalInfo) {
              this.info.add([
                context.text(
                  LocaleService.getText(UIText[UILabels.PersonalInfo]),
                  {
                    width: PIXELS_PER_TILE * 5.5,
                    font: "medodica",
                    size: FONT_SIZE - 1,
                    align: "center",
                  }
                ),
                context.color(context.Color.fromHex(DIALOG_BOX_TEXT_COLOR)),
                context.pos(point.x, point.y),
                context.anchor("top"),
              ]);
              continue;
            }
            this.createTexts(this.info, point);
            break;
          }
        }
      }
    }
  }

  createTexts(container: GameObj, { x, y, name }: Point) {
    container.add([
      context.text(LocaleService.getText(UIText[name!]), {
        font: "medodica",
        size: FONT_SIZE,
        styles: {},
      }),
      context.area(),
      context.pos(context.vec2(x, y)),
      context.anchor("center"),
      context.color(context.Color.fromHex(DIALOG_BOX_TEXT_COLOR)),
    ]);
  }

  createPortrait({ x, y }: Point) {
    if (!this.info) {
      return;
    }
    this.info.add([
      context.sprite(CharactersPortait[Character.Shahid], {
        anim: PortraitAnimation.Idle,
      }),
      /** Place it at the center of Portrait Container */
      context.pos(x, y),
      context.anchor("center"),
    ]);
  }

  createExternalLinks({ x, y }: Point) {
    if (!this.info) {
      return;
    }
    const options = Object.values(Socials);

    const buttonWidth = options.length * PIXELS_PER_TILE;
    const paddingWidth = (options.length + 1) * BUTTON_PADDING;

    const uiWidth = buttonWidth + paddingWidth;

    const parent = this.info.add([
      context.rect(uiWidth, PIXELS_PER_TILE, {
        fill: false,
      }),
      context.scale(0.5),
      /** Place it at the center of Portrait Container */
      context.pos(x + uiWidth / 4, y),
    ]);

    options.forEach((social, idx) => {
      const xPosition =
        idx * PIXELS_PER_TILE + BUTTON_PADDING + BUTTON_PADDING * idx;

      const button = parent.add([
        context.sprite("socials", { frame: SocialButtonTileMap[social] }),
        context.pos(xPosition, 0),
        context.area(),
        cursor(),
      ]);

      button.onClick(() => {
        window.open(SocialLinkMap[social], "_blank");
      });
    });
  }

  createOptions({ x, y, height, width }: Point) {
    if (!this.settings) {
      return;
    }
    const optionsContainer = this.settings.add([
      context.rect(width, height, { fill: false }),
      context.pos(x, y),
      context.area(),
    ]);

    const uiToggleOptions = [
      {
        label: LocaleService.getText(UIText[UILabels.Music]),
        value: StateService.get().musicEnabled,
        onClick: (value: boolean) => {
          StateService.set({ musicEnabled: value });
          SoundService.toggleMusic();
        },
      },
      {
        label: LocaleService.getText(UIText[UILabels.SFX]),
        value: StateService.get().sfxEnabled,
        onClick: (value: boolean) => {
          StateService.set({ sfxEnabled: value });
        },
      },
    ];

    uiToggleOptions.forEach((option, idx) => {
      const root = optionsContainer.add([
        context.rect(width, PIXELS_PER_TILE, { fill: false }),
        context.pos(0, idx * PIXELS_PER_TILE),
      ]);

      root.add([
        context.text(option.label, {
          font: "medodica",
          size: FONT_SIZE,
        }),
        context.pos(PIXELS_PER_TILE / 4, PIXELS_PER_TILE / 4),
        context.color(context.Color.fromHex(DIALOG_BOX_TEXT_COLOR)),
      ]);

      new Toggle(root, option.value, option.onClick);
    });
  }

  createLocales({ x, y, width }: Point) {
    if (!this.settings) {
      return;
    }
    const container = this.settings.add([
      context.rect(width, PIXELS_PER_TILE, { fill: false }),
      context.pos(x, y),
      context.fixed(),
      context.z(100),
      context.area(),
      context.anchor("topleft"),
    ]);

    Object.values(Locales).forEach((_l, idx) => {
      const xPosition =
        idx * FLAG_PIXEL_WIDTH + FLAG_PADDING + FLAG_PADDING * idx;
      const yPosition = FLAG_PADDING;

      const locale = container?.add([
        context.rect(FLAG_PIXEL_WIDTH, FLAG_PIXEL_HEIGHT, { fill: true }),
        context.pos(xPosition, yPosition),
        _l,
        "locales",
      ]);

      const flag = locale.add([
        context.sprite("flags", { frame: idx }),
        context.area(),
        cursor(),
      ]);

      flag.onClick(() => {
        StateService.set({ locale: _l });
        this.createSettings();
      });
    });

    const current = StateService.get().locale;

    container.get("locales").forEach((obj) => obj.unuse("outline"));
    container.get(current)?.[0]?.use(context.outline(2, context.Color.BLACK));
  }

  createButtons({ x, y, width, height }: Point) {
    if (!this.settings) {
      return;
    }

    const parent = this.settings.add([
      context.rect(width, height, { fill: false }),
      context.pos(x, y),
      context.area(),
      cursor(),
    ]);

    parent.add([
      context.text(LocaleService.getText("settings.close"), {
        font: "medodica",
        size: FONT_SIZE,
      }),
      context.pos(parent.width / 2, parent.height / 2),
      context.anchor("center"),
      context.color(context.Color.fromHex(DIALOG_BOX_TEXT_COLOR)),
    ]);

    parent.onClick(() => this.toggleSettings());
  }

  destroy() {
    this.settings?.destroy();
    this.ui?.destroy();
  }
}

export default UI;
