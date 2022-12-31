import * as PIXI from "pixi.js";
import { FederatedPointerEvent, LINE_CAP, LINE_JOIN } from "pixi.js";
import { MouseEventButton } from "../../../pkg/domEvent";

type PaintOperation = "add" | "erase";
type Point2d = { x: number; y: number };

export class PaintLayer extends PIXI.Graphics {
  _lastPosition: Point2d | undefined;

  public onPaint: () => void = () => {
    // foo
  };

  constructor(width: number, height: number) {
    super();

    this.interactive = true;
    this.hitArea = new PIXI.Rectangle(0, 0, width, height);
    //this.interactiveChildren = true;

    this.on("pointermove", this._onMouseEvent);
    this.on("pointerdown", this._onMouseEvent);
    this.on("pointerup", this._onMouseEvent);
    this.on("pointerover", this._onMouseEvent);
    this.on("pointerout", this._onMouseEvent);
  }

  private _onMouseEvent(e: FederatedPointerEvent) {
    e.originalEvent.preventDefault();
    e.originalEvent.stopPropagation();

    const isPrimaryButton = e.buttons === MouseEventButton.Primary;
    const isSecondaryButton = e.buttons === MouseEventButton.Secondary;

    if (!(isPrimaryButton || isSecondaryButton)) {
      return;
    }

    const mousePosition = e.global;

    console.log(e.type);

    if ("pointermove" === e.type) {
      this.paintExtend(mousePosition);
    } else {
      const paintType = isPrimaryButton ? "add" : "erase";
      this.paintNew(mousePosition, paintType);
    }
    this.onPaint();
  }

  private paintNew(
    pos: { x: number; y: number },
    operation: PaintOperation
  ): void {
    console.log("paintNew()", pos, operation);
    // const globalCompositeOperation =
    //   operation === "add" ? "source-over" : "destination-out";

    this.drawLine(pos, pos);
  }

  private paintExtend(pos: Point2d): void {
    console.log("paintExtend()", pos);

    if (this._lastPosition === undefined) {
      this._lastPosition = pos;
    }

    this.drawLine(this._lastPosition, pos);
    this._lastPosition = pos;
  }

  private drawLine(from: Point2d, to: Point2d): void {
    this.lineStyle({
      width: 10,
      color: 0xff0000,
      cap: LINE_CAP.ROUND,
      join: LINE_JOIN.ROUND,
    });
    this.moveTo(from.x, from.y);
    this.lineTo(to.x + 10, to.y + 10);
    this.onPaint();
  }
}
