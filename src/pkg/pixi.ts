import * as PIXI from "pixi.js";
import { FederatedMouseEvent } from "pixi.js";
import { Point2D } from "./geometry";
import { OutlineFilter } from "pixi-filters";

export function eventToPosition(e: FederatedMouseEvent): Point2D {
  return { x: e.global.x, y: e.global.y };
}

export async function createOutline(
  renderer: PIXI.IRenderer,
  texture: PIXI.Texture,
  width: number,
  height: number
): Promise<PIXI.Sprite> {
  const renderTexture = PIXI.RenderTexture.create({ width, height });
  const textureSprite = PIXI.Sprite.from(texture);
  textureSprite.scale.x = width / texture.orig.width;
  textureSprite.scale.y = height / texture.orig.height;

  // add texture with outline
  const textureWithOutline = new PIXI.Container();
  textureWithOutline.filters = [new OutlineFilter(1, 0x000000)];
  textureWithOutline.addChild(textureSprite);
  renderer.render(textureWithOutline, { renderTexture });

  // erase texture
  textureSprite.blendMode = PIXI.BLEND_MODES.ERASE;
  renderer.render(textureSprite, { renderTexture, clear: false });

  return PIXI.Sprite.from(renderTexture);
}
