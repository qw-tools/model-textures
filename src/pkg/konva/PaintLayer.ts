import { Brush, getDefaultBrush } from "./Brush";
import { Line } from "konva/lib/shapes/Line";
import { Layer } from "konva/lib/Layer";
import { MouseEventButton, MouseEventType } from "../domEvent";

export class PaintLayer extends Layer {
  public onPaint: () => void = function (): void {
    // do nothing
  };
  private lastLine: Line = new Line();
  public brush: Brush = getDefaultBrush();

  constructor() {
    super({ listening: false });
  }

  public onMouseEvent(event: MouseEvent): void {
    const isPrimaryButton = event.buttons === MouseEventButton.Primary;
    const isSecondaryButton = event.buttons === MouseEventButton.Secondary;

    if (!(isPrimaryButton || isSecondaryButton)) {
      return;
    }

    const mousePosition = this.getRelativePointerPosition();

    if (MouseEventType.Move === event.type) {
      this.paintExtend(mousePosition);
    } else {
      const paintType = isPrimaryButton ? "add" : "erase";
      this.paintNew(mousePosition, paintType);
    }
    this.onPaint();
  }

  private paintNew(pos: { x: number; y: number }, paintType: string): void {
    const globalCompositeOperation =
      paintType === "add" ? "source-over" : "destination-out";

    this.lastLine = new Line({
      globalCompositeOperation,
      lineCap: this.brush.shape || "round",
      lineJoin: "round", // round join for smoother lines
      stroke: this.brush.color,
      strokeWidth: this.brush.size,
      // add point twice, so we have some drawings even on a simple click
      points: [pos.x, pos.y, pos.x, pos.y],
      listening: false,
    });
    this.add(this.lastLine);
  }

  private paintExtend(pos: { x: number; y: number }): void {
    const newPoints = this.lastLine.points().concat([pos.x, pos.y]);
    this.lastLine.points(newPoints);
  }
}
