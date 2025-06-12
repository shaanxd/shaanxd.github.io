import Player from "../objects/player";

export type Coordinate = {
  x: number;
  y: number;
};

export type Dimension = {
  width: number;
  height: number;
};

export type Point = {
  name?: string;
} & Dimension &
  Coordinate;

export type KeyValuePair<T = string> = { [key: string]: T };

export type DialogParams = {
  player: Player;
};

export type DialogOption = {
  type: "prompt.yes" | "prompt.no";
  onClick?: (params: DialogParams) => void;
};

export type Dialog = {
  line: string;
  options?: DialogOption[];
};

export type TileMapJsonData = {
  compressionlevel: number;
  height: number;
  infinite: boolean;
  layers: LayersEntity[];
  nextlayerid: number;
  nextobjectid: number;
  orientation: string;
  renderorder: string;
  tiledversion: string;
  tileheight: number;
  tilesets?: TilesetsEntity[] | null;
  tilewidth: number;
  type: string;
  version: string;
  width: number;
};
export type LayersEntity = {
  data?: number[] | null;
  height?: number | null;
  id: number;
  name: string;
  opacity: number;
  type: string;
  visible: boolean;
  width?: number | null;
  x: number;
  y: number;
  draworder?: string | null;
  objects?: ObjectsEntity[] | null;
};
export type ObjectsEntity = {
  height: number;
  id: number;
  name: string;
  rotation: number;
  type: string;
  visible: boolean;
  width: number;
  x: number;
  y: number;
  point?: boolean | null;
};
export type TilesetsEntity = {
  firstgid: number;
  source: string;
};
