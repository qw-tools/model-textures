import * as PIXI from "pixi.js";
import { Point2D } from "./types";

export class PaintBuffer {
  mode: "add" | "remove" = "add";
  texture: PIXI.RenderTexture;
  brush: PIXI.Sprite;
  private _container: PIXI.Container = new PIXI.Container();

  constructor(texture: PIXI.RenderTexture) {
    this.texture = texture;
    this.brush = PIXI.Sprite.from(texture);
  }

  hasContent(): boolean {
    return this._container.children.length > 0;
  }

  addPoint(pos: Point2D): void {
    const spr = PIXI.Sprite.from(this.texture);
    spr.x = pos.x - this.texture.orig.width / 2;
    spr.y = pos.y - this.texture.orig.height / 2;

    if (this.mode === "remove") {
      spr.blendMode = PIXI.BLEND_MODES.ERASE;
    } else {
      spr.blendMode = PIXI.BLEND_MODES.NORMAL;
    }

    this._container.addChild(spr);
  }

  addLine(from: Point2D, to: Point2D): void {
    this.addPoint(to);

    const delta = { x: from.x - to.x, y: from.y - to.y };
    const deltaLength = Math.sqrt(delta.x ** 2 + delta.y ** 2);
    const factor = this.texture.orig.width / 8;

    if (deltaLength >= factor) {
      const additionalPoints = Math.ceil(deltaLength / factor);

      for (let i = 1; i < additionalPoints; i++) {
        const pos = {
          x: to.x + delta.x * (i / additionalPoints),
          y: to.y + delta.y * (i / additionalPoints),
        };

        this.addPoint(pos);
      }
    }
  }

  renderTo(target: PIXI.RenderTexture, renderer: PIXI.IRenderer): void {
    if (!this.hasContent()) {
      return;
    }

    renderer.render(this._container, {
      renderTexture: target,
      clear: false,
    });

    this.clear();
  }

  clear(): void {
    this._container.removeChildren();
  }
}
