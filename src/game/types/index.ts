import Player from "../objects/player";

export type Point = {
  name?: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type KeyValuePair<T = string> = { [key: string]: T };

export type DialogParams = {
  player: Player;
};

export type DialogOption = {
  type: "Yes" | "No";
  onClick?: (params: DialogParams) => void;
};

export type Dialog = {
  line: string;
  options?: DialogOption[];
};
