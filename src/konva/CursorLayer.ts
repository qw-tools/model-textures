import { Brush } from "./Brush";
import { Layer } from "konva/lib/Layer";
import { MouseEventType } from "../components/Event";
import { Circle } from "konva/lib/shapes/Circle";
import { Rect } from "konva/lib/shapes/Rect";

export class CursorLayer extends Layer {
  private _brush: Brush = {
    color: "",
    size: 1,
    shape: "",
  };
  private cursor: Circle | Rect = new Rect({ visible: false });

  constructor() {
    super();
    this.add(this.cursor);
  }

  get brush(): Brush {
    return this._brush;
  }

  set brush(brush: Brush) {
    this.onBrushChange(brush);
    this._brush = brush;
  }

  private onBrushChange(newBrush: Brush): void {
    if (newBrush.shape !== this.brush.shape) {
      const wasVisible = this.cursor.isVisible();
      this.cursor = createCursorFromBrush(newBrush);
      this.cursor.visible(wasVisible);
      this.destroyChildren();
      this.add(this.cursor);
    }

    if (newBrush.color !== this.brush.color) {
      this.cursor.stroke(newBrush.color);
    }

    if (newBrush.size !== this.brush.size) {
      if (newBrush.shape === "square") {
        this.cursor.setAttrs({
          width: newBrush.size,
          height: newBrush.size,
          offsetX: newBrush.size / 2,
          offsetY: newBrush.size / 2,
        });
      } else {
        (this.cursor as Circle).radius(newBrush.size / 2);
      }
    }
  }

  public onMouseEvent(event: MouseEvent): void {
    if (MouseEventType.Leave === event.type) {
      this.cursor.hide();
      return;
    }

    if (MouseEventType.Enter === event.type) {
      this.cursor.show();
    }

    const mousePosition = this.getRelativePointerPosition();
    this.cursor.position(mousePosition);
  }
}

function createCursorFromBrush(brush: Brush): Circle | Rect {
  const minSize = 1;
  const strokeWidth = 2;

  const sharedAttributes = {
    listening: false,
    visible: false,
    stroke: brush.color,
    strokeWidth,
  };

  if ("round" === brush.shape) {
    const radius = Math.max(minSize, brush.size / 2 - strokeWidth / 2);
    return new Circle({
      radius: Math.max(minSize, radius),
      ...sharedAttributes,
    });
  } else {
    const size = Math.max(1, brush.size - strokeWidth);
    return new Rect({
      width: size,
      height: size,
      offsetX: brush.size / 2,
      offsetY: brush.size / 2,
      ...sharedAttributes,
    });
  }
}
