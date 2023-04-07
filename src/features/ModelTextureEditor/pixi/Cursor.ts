import { Color, Graphics, IRenderer } from "pixi.js";
import { Brush } from "./brush";

export function createCssCursor(renderer: IRenderer, brush: Brush): string {
  const graphics = new Graphics();
  const sideLength = brush.size / 2;

  graphics.lineStyle(2, new Color(brush.color));

  if (brush.shape === "circle") {
    graphics.drawCircle(0, 0, sideLength);
  } else if (brush.shape === "square") {
    graphics.drawRect(0, 0, brush.size, brush.size);
  }

  const cursorCanvas = renderer.extract.canvas(graphics);

  const css = `url(${cursorCanvas.toDataURL?.()}) ${sideLength} ${sideLength}, auto`;
  console.log("css", css);
  return css;
}
