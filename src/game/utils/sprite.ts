import { Asset, SpriteData } from "kaplay";
import context from "../context";

export const getSpriteMetadata = (sprite: string) =>
  context.getSprite(sprite) as Asset<SpriteData>;

export const getSpriteScale = async (sprite: string) => {
  try {
    const { width, height } = await getSpriteMetadata(sprite);

    const scaleX = window.innerWidth / width;
    const scaleY = window.innerHeight / height;
    return Math.max(scaleX, scaleY);
  } catch {
    return 1;
  }
};
