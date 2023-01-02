import * as PIXI from "pixi.js";
import { generateBrush } from "./brushTexture";
import { PaintBuffer } from "./PaintBuffer";
import { Brush } from "./brush";
import { MouseEventButton } from "../../../pkg/domEvent";
import { Point2D } from "../../../pkg/math";
import { nullOperation } from "../../../pkg/functions";
import { eventToPosition } from "../../../pkg/pixi";

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
  onChange: () => void = nullOperation;

  constructor(renderer: PIXI.IRenderer, width: number, height: number) {
    this._width = width;
    this._height = height;
    this._renderer = renderer;
    this._container = new PIXI.Container();
    this._paintBuffer = new PaintBuffer();
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
    this._container.on("pointerdown", this._onPointerDown.bind(this));
    this._container.on("pointerup", this._onPointerUp.bind(this));
    this._container.on("pointermove", this._onPointerMove.bind(this));
    this._container.on("pointerenter", this._onPointerEnter.bind(this));
    this._container.on("pointerleave", this._onPointerLeave.bind(this));

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

  private _onPointerUp(): void {
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
    if (e.buttons === MouseEventButton.None) {
      this._isDrawing = false;
    }
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
