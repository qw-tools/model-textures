import * as PIXI from "pixi.js";
import { FederatedMouseEvent } from "pixi.js";
import BrushGenerator from "./BrushGenerator";
import { PaintBuffer } from "./PaintBuffer";

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0xff0066,
});

app.ticker = new PIXI.Ticker();
app.render();

const appView = app.view as HTMLCanvasElement;
appView.addEventListener("contextmenu", (e) => e.preventDefault());

document.getElementById("app")?.appendChild(appView);

const spriteRenderTexture = PIXI.RenderTexture.create({
  width: app.screen.width,
  height: app.screen.height,
});
const sprite = new PIXI.Sprite(spriteRenderTexture);
sprite.interactive = true;

//const spritePool = new SpritePool();
const brushGenerator = new BrushGenerator(app.renderer as PIXI.Renderer);
const brushTexture = brushGenerator.generate({
  size: 24,
  color: 0xffff00,
  smoothing: 0.5,
});

const paintBuffer = new PaintBuffer(brushTexture);

init();

function init() {
  console.log(app.screen);

  let isDrawing = false;
  let lastPosition = { x: 0, y: 0 };

  const onDown = (e: FederatedMouseEvent) => {
    lastPosition = { x: e.global.x, y: e.global.y };
    isDrawing = true;

    if (e.buttons === 2) {
      paintBuffer.mode = "remove";
    } else {
      paintBuffer.mode = "add";
    }

    paintBuffer.addPoint(lastPosition);
  };

  const onMove = (e: FederatedMouseEvent) => {
    const position = { x: e.global.x, y: e.global.y };

    if (isDrawing) {
      paintBuffer.addLine(lastPosition, position);
    }

    lastPosition = position;
  };
  const onUp = () => {
    isDrawing = false;
  };

  app.stage.on("pointerdown", onDown);
  app.stage.on("pointermove", onMove);
  app.stage.on("pointerup", onUp);

  app.ticker.add(() => {
    if (!paintBuffer.hasContent()) {
      return;
    }

    paintBuffer.renderTo(spriteRenderTexture, app.renderer);
    app.render();
  });

  app.stage.addChild(sprite);
  app.ticker.start();

  console.log("init - done");
}

// function updateBrush() {
//   console.log("updateBrush");
//   brushTexture = brushGenerator.get(
//     guiParams.brushSize,
//     guiParams.brushColor,
//     guiParams.brushSmoothing,
//     guiParams.useEraser
//   );
// }
