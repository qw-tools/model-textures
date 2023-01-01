import {
  BLEND_MODES,
  Container,
  IRenderer,
  RenderTexture,
  Sprite,
} from "pixi.js";
import { Point2D } from "../../../pkg/math";
import { nullOperation } from "../../../pkg/functions";

export class PaintBuffer {
  private readonly _container: Container = new Container();
  private _brush: RenderTexture | undefined;
  //private _brushSprite: Sprite;
  private _blendMode: number = BLEND_MODES.NORMAL;

  onChange: () => void = nullOperation;

  get brush(): RenderTexture | undefined {
    return this._brush;
  }

  set brush(brush: RenderTexture | undefined) {
    this._brush = brush;
    //this._brushSprite = Sprite.from(brush);
  }

  get blendMode(): number {
    return this._blendMode;
  }

  set blendMode(mode: number) {
    this._blendMode = mode;
  }

  isEmpty(): boolean {
    return this._container.children.length === 0;
  }

  addPoint(pos: Point2D): void {
    if (this.brush === undefined) {
      return;
    }

    const spr = Sprite.from(this.brush);
    spr.x = pos.x - spr.texture.orig.width / 2;
    spr.y = pos.y - spr.texture.orig.height / 2;
    spr.blendMode = this.blendMode;
    this._container.addChild(spr);
  }

  addLine(from: Point2D, to: Point2D): void {
    if (this.brush === undefined) {
      return;
    }

    this.addPoint(to);

    const delta = { x: from.x - to.x, y: from.y - to.y };
    const deltaLength = Math.sqrt(delta.x ** 2 + delta.y ** 2);
    const factor = this.brush.orig.width / 8;

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

  renderTo(target: RenderTexture, renderer: IRenderer): void {
    renderer.render(this._container, {
      renderTexture: target,
      clear: false,
    });
  }

  clear(): void {
    this._container.removeChildren();
  }
}
