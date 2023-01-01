import * as PIXI from "pixi.js";
import { generateBrush } from "./brushTexture";
import { PaintBuffer } from "./PaintBuffer";
import { Brush, Point2D } from "./types";
import { MouseEventButton } from "../../../pkg/domEvent";

export class PaintLayer {
  private readonly _width: number;
  private readonly _height: number;
  private readonly _renderer: PIXI.IRenderer;
  private readonly _container: PIXI.Container;
  private readonly _paintBuffer: PaintBuffer;
  private readonly _paintSprite: PIXI.Sprite;
  private _paintTexture: PIXI.RenderTexture;
  private _lastPosition: Point2D = { x: 0, y: 0 };
  private _brush: Brush;
  private _isDrawing = false;
  onChange: () => void = () => {
    // do nothing
  };

  constructor(renderer: PIXI.IRenderer, width: number, height: number) {
    this._width = width;
    this._height = height;
    this._renderer = renderer;
    this._paintBuffer = new PaintBuffer();
    this._container = new PIXI.Container();
    this._paintSprite = new PIXI.Sprite();
    this._paintSprite.interactive = true;
    this._paintTexture = PIXI.RenderTexture.create();
    this._container.addChild(this._paintSprite);
    this._reset();

    this._brush = {
      size: 24,
      color: "#ff00ff",
      smoothing: 0.5,
      shape: "circle",
    };
    this.brush = this._brush;

    // events
    this._container.on("pointerdown", (e: PIXI.FederatedMouseEvent) => {
      this._onPointerDown(e);
    });
    this._container.on("pointerup", (e: PIXI.FederatedMouseEvent) => {
      this._onPointerUp(e);
    });
    this._container.on("pointermove", (e: PIXI.FederatedMouseEvent) => {
      this._onPointerMove(e);
    });
    this._container.on("pointerenter", (e: PIXI.FederatedMouseEvent) => {
      this._onPointerEnter(e);
    });
    this._container.on("pointerleave", (e: PIXI.FederatedMouseEvent) => {
      this._onPointerLeave(e);
    });

    // ticker
    const ticker = new PIXI.Ticker();
    ticker.add(() => this._onTick());
    ticker.start();
  }

  get container(): PIXI.Container {
    return this._container;
  }

  get brush(): Brush {
    return this._brush;
  }

  set brush(brush: Brush) {
    this._brush = brush;
    this._paintBuffer.brush = generateBrush(this._renderer, brush);
  }

  private _onTick(): void {
    if (this._paintBuffer.isEmpty()) {
      return;
    }

    this._paintBuffer.renderTo(this._paintTexture, this._renderer);
    this._paintBuffer.clear();
    this.onChange();
  }

  private _onPointerDown(e: PIXI.FederatedMouseEvent): void {
    this._isDrawing = true;
    this._lastPosition = eventToPosition(e);

    if (e.buttons === MouseEventButton.Primary) {
      this._paintBuffer.blendMode = PIXI.BLEND_MODES.NORMAL;
    } else if (e.buttons === MouseEventButton.Secondary) {
      this._paintBuffer.blendMode = PIXI.BLEND_MODES.ERASE;
    }

    this._paintBuffer.addPoint(this._lastPosition);
  }

  private _onPointerUp(e: PIXI.FederatedMouseEvent): void {
    this._isDrawing = false;
  }

  private _onPointerMove(e: PIXI.FederatedMouseEvent): void {
    const position = eventToPosition(e);

    if (this._isDrawing) {
      this._paintBuffer.addLine(this._lastPosition, position);
    }

    this._lastPosition = position;
  }

  private _onPointerEnter(e: PIXI.FederatedMouseEvent): void {
    this._lastPosition = eventToPosition(e);
  }

  private _onPointerLeave(e: PIXI.FederatedMouseEvent): void {
    this._lastPosition = eventToPosition(e);
  }

  private _reset(): void {
    this._paintTexture.destroy(true);
    this._paintTexture = PIXI.RenderTexture.create({
      width: this._width,
      height: this._height,
    });
    this._paintSprite.texture = this._paintTexture;
  }

  clear(): void {
    this._reset();
    this.onChange();
  }
}

function eventToPosition(e: PIXI.FederatedMouseEvent): Point2D {
  return { x: e.global.x, y: e.global.y };
}
