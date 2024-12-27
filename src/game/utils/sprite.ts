import { Asset, SpriteData } from "kaplay";
import context from "../context";
import { getRoundedInt } from "./number";

export const getSpriteMetadata = (sprite: string) =>
  context.getSprite(sprite) as Asset<SpriteData>;

export const getSpriteScale = async (sprite: string) => {
  try {
    const { width, height } = await getSpriteMetadata(sprite);

    const mapAspectRatio = width / height;
    const windowAspectRatio = window.innerWidth / window.innerHeight;

    let screen = window.innerWidth;
    let map = width;

    if (
      mapAspectRatio > windowAspectRatio ||
      window.innerHeight > window.innerWidth
    ) {
      screen = window.innerHeight;
      map = height;
    }
    return getRoundedInt(Math.max(screen, map) / Math.min(screen, map), 1);
  } catch {
    return 1;
  }
};
