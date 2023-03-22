import * as PIXI from "pixi.js";
import { Brush } from "./brush";

export class Cursor extends PIXI.Graphics {
  toCss(renderer: PIXI.Renderer, brush: Brush): string {
    console.log("toCss", brush);
    this.clear();

    const sideLength = brush.size / 2;

    this.lineStyle(2, new PIXI.Color(brush.color));

    if (brush.shape === "circle") {
      this.drawCircle(0, 0, sideLength);
    } else if (brush.shape === "square") {
      this.drawRect(0, 0, brush.size, brush.size);
    }

    const cursorCanvas = renderer.extract.canvas(this);

    return `url(${cursorCanvas.toDataURL?.()}) ${sideLength} ${sideLength}, auto`;
  }
}
