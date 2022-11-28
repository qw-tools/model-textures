import { Shape } from "konva/lib/Shape";
import { Line } from "konva/lib/shapes/Line";
import { BrushSettings, getDefaultBrushSettings } from "../Brush";
import { Circle } from "konva/lib/shapes/Circle";
import { Layer } from "konva/lib/Layer";
import { Group } from "konva/lib/Group";

enum MouseButton {
  Primary = 1,
  Secondary = 2,
}

enum MouseEventType {
  Move = "mousemove",
  Down = "mousedown",
  Enter = "mouseenter",
  Leave = "mouseleave",
}

export class PaintLayer extends Layer {
  private cursor: Shape = new Shape();
  private lastLine: Line = new Line();
  public readonly paint: Group = new Group();
  public brush: BrushSettings = getDefaultBrushSettings();

  constructor() {
    super({ listening: false });

    this.cursor = new Circle({
      radius: this.brush.size,
      stroke: this.brush.color,
      strokeWidth: 2,
    });

    this.add(this.paint, this.cursor);
  }

  public onMouseEvent(event: MouseEvent): void {
    if (MouseEventType.Leave === event.type) {
      this.cursor.hide();
      return;
    }

    if (MouseEventType.Enter === event.type) {
      this.cursor.show();
    }

    this.updateCursor();

    const isPrimaryButton = event.buttons === MouseButton.Primary;
    const isSecondaryButton = event.buttons === MouseButton.Secondary;

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
  }

  private updateCursor(): void {
    const mousePosition = this.getRelativePointerPosition();

    const cursorProps = {
      stroke: this.brush.color,
      strokeWidth: 2,
    };

    this.cursor.position(mousePosition);

    if ("round" === this.brush.shape) {
      const cursorRadius = this.brush.size / 2 - cursorProps.strokeWidth / 2;
      this.cursor.setAttrs({
        radius: Math.max(1, cursorRadius),
        ...cursorProps,
        ...mousePosition,
      });
    }
    // TODO: fix change of brush type
    // } else {
    //   const cursorSize = Math.max(1, this.brush.size - cursorProps.strokeWidth);
    //   this.cursor = new Rect({
    //     width: cursorSize,
    //     height: cursorSize,
    //     x: mousePosition.x - cursorSize / 2,
    //     y: mousePosition.y - cursorSize / 2,
    //     ...cursorProps,
    //   });
    // }

    //this.cursor.cache();
    // this.destroyChildren();
    // this.add(this.cursor);
  }

  private paintNew(pos: { x: number; y: number }, paintType: string): void {
    const globalCompositeOperation =
      paintType === "add" ? "source-over" : "destination-out";

    this.lastLine = new Line({
      stroke: this.brush.color,
      strokeWidth: this.brush.size,
      globalCompositeOperation,
      lineCap: this.brush.shape,
      lineJoin: "round", // round join for smoother lines
      // add point twice, so we have some drawings even on a simple click
      points: [pos.x, pos.y, pos.x, pos.y],
      listening: false,
    });
    this.paint.add(this.lastLine);
  }

  private paintExtend(pos: { x: number; y: number }): void {
    const newPoints = this.lastLine.points().concat([pos.x, pos.y]);
    this.lastLine.points(newPoints);
  }
}
