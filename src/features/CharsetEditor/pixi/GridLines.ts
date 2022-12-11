import * as PIXI from "pixi.js";

export class GridLines extends PIXI.Graphics {
  color = 0xff00ff;

  draw(cellSize: number, length: number): void {
    this.clear();
    this.lineStyle(1, this.color);

    const steps = Math.floor(length / cellSize);

    for (let colIndex = 1; colIndex < steps; colIndex++) {
      const x = colIndex * cellSize;
      this.moveTo(x, 0);
      this.lineTo(x, length);
    }

    for (let rowIndex = 1; rowIndex < steps; rowIndex++) {
      const y = rowIndex * cellSize;
      this.moveTo(0, y);
      this.lineTo(length, y);
    }
  }
}
