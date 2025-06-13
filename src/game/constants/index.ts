import { Key } from "kaplay";
import {
  Character,
  Door,
  Interactable,
  Layer,
  NPCAnimation,
  PlayerAnimation,
  PlayerMove,
  PlayerSpawn,
  Scene,
  UILabels,
  UIButtonType,
  Socials,
} from "../enums";
import { KeyValuePair } from "../types";

export const PIXELS_PER_TILE = 16;

export const PLAYER_DEFAULT_SPEED = 50;

export const CHARACTER_HEIGHT = PIXELS_PER_TILE * 1.5;
export const CHARACTER_WIDTH = PIXELS_PER_TILE;

export const DOOR_HEIGHT = PIXELS_PER_TILE * 2;
export const DOOR_WIDTH = PIXELS_PER_TILE;

export const DIALOG_BOX_TEXT_COLOR = "#66522f";
export const DIALOG_BOX_MAX_WIDTH = 1200;
export const DIALOG_BOX_HEIGHT = PIXELS_PER_TILE * 4;
export const DIALOG_BOX_TEXT_SPEED = 0.02;
export const DIALOG_BOX_OPTIONS_HEIGHT = 8;
export const UI_SCALE = 3;
export const FONT_SIZE = 9;

export const LayerOrder = {
  [Layer.CharactersForeground]: 4,
  [Layer.Player]: 3,
  [Layer.CharactersBackground]: 2,
  [Layer.Doors]: 1,
  [Layer.VerticalDoors]: 4,
};

export const PlayerMoveKeys: { [key in PlayerMove]?: Key } = {
  [PlayerMove.Up]: "w",
  [PlayerMove.Down]: "s",
  [PlayerMove.Left]: "a",
  [PlayerMove.Right]: "d",
};

export const IdleAnimations = [
  PlayerAnimation.Read,
  PlayerAnimation.CheckPhone,
];

export const DoorSpawnMapping: KeyValuePair = {
  [Door.BalconyEntrance]: PlayerSpawn.PlayerBalcony,
};

export const SceneSpawnMap: KeyValuePair<Scene> = {
  [Interactable.BalconyEntrance]: Scene.Balcony,
  [Interactable.ApartmentEntrance]: Scene.Apartment,
};

export const NPCAnimationMap = {
  [NPCAnimation.IdleDown]: [0, 5],
  [NPCAnimation.IdleUp]: [6, 11],
  [NPCAnimation.IdleSide]: [12, 17],
  [NPCAnimation.IdleSitSide]: [18, 23],
  [NPCAnimation.CheckPhone]: [24, 29],
  [NPCAnimation.Read]: [30, 35],
};

export const EnabledDoors = [
  Door.BalconyEntrance,
  Door.RoomEntrance,
  Door.BathroomEntrance,
];

export const VerticalDoors = [Door.BathroomEntrance];

export const CharactersPortait = {
  [Character.Shahid]: "shahid-portrait",
  [Character.Hafsah]: "hafsah-portrait",
};

export const UIText: KeyValuePair<string> = {
  [UILabels.Music]: "settings.music",
  [UILabels.SFX]: "settings.sfx",
  [UILabels.Settings]: "settings.settings",
  [UILabels.Locales]: "settings.changeLanguage",
  [UILabels.Credits]: "info.credits",
  [UILabels.ExternalLinks]: "info.externalLinks",
  [UILabels.PersonalInfo]: "info.personalInfo",
  [UILabels.Info]: "info.info",
};

export const UIButtonTileMap = {
  [UIButtonType.Home]: 0,
  [UIButtonType.Question]: 1,
  [UIButtonType.Information]: 2,
  [UIButtonType.Settings]: 3,
};

export const SocialButtonTileMap = {
  [Socials.Email]: 0,
  [Socials.GitHub]: 1,
  [Socials.Instagram]: 2,
  [Socials.LinkedIn]: 3,
};

export const SocialLinkMap = {
  [Socials.Email]: "mailto:shaahid.xd@gmail.com",
  [Socials.GitHub]: "http://www.github.com/shaanxd",
  [Socials.Instagram]: "http://www.instagram.com/jhnxed.xd",
  [Socials.LinkedIn]: "http://www.linkedin.com/in/shahid-xd",
};
