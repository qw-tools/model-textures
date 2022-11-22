<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import { ModelViewerElement } from "@google/model-viewer";

const baseUrl = import.meta.env.BASE_URL;

const store = reactive({
  rotate: true,
  color: { r: 0, g: 0, b: 0, a: 0 },
  skinTextureURI: `${baseUrl}/assets/models/playerout0_tex00.png`,
});

const handleDrop = (event: DragEvent) => {
  // prevent opening image in browser
  event.stopPropagation();
  event.preventDefault();

  if (!event.dataTransfer) {
    return;
  }

  setPlayerTextureByFile(event.dataTransfer.files[0]);
};

const handleCustomSkinChange = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;

  if (!files) {
    return;
  }

  setPlayerTextureByFile(files[0]);
};

const setPlayerTextureByFile = (file: File) => {
  const reader = new FileReader();

  reader.addEventListener("load", async () => {
    if (!viewer.model || 0 === viewer.model.materials.length) {
      return;
    }

    const texture = await viewer.createTexture(reader.result as string);

    if (!texture) {
      return;
    }

    viewer.model.materials[0].pbrMetallicRoughness.baseColorTexture.setTexture(
      texture
    );
    store.skinTextureURI = reader.result as string;
    renderPlayerSkinToCanvas();
  });

  reader.readAsDataURL(file);
};

const updatePlayerTexture = () => setPlayerTextureByCanvas(playerCanvas);

const setPlayerTextureByCanvas = async (canvas: HTMLCanvasElement) => {
  if (!viewer.model || 0 === viewer.model.materials.length) {
    return;
  }

  const texture = await viewer.createTexture(canvas.toDataURL());

  if (!texture) {
    return;
  }

  viewer.model.materials[0].pbrMetallicRoughness.baseColorTexture.setTexture(
    texture
  );
};

let viewer: ModelViewerElement;
let playerCanvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;
let playerCanvasBoundingBox: DOMRect;
let playerImage: HTMLImageElement;

const renderPlayerSkinToCanvas = () => {
  const canvasDrawTimeout = 40;
  window.setTimeout(() => {
    ctx?.drawImage(
      playerImage,
      0,
      0,
      playerImage.width,
      playerImage.height,
      0,
      0,
      playerCanvas.width,
      playerCanvas.height
    );
  }, canvasDrawTimeout);
};

onMounted(() => {
  viewer = document.getElementById("PlayerViewer") as ModelViewerElement;
  playerImage = document.getElementById("PlayerImage") as HTMLImageElement;
  playerCanvas = document.getElementById("PlayerCanvas") as HTMLCanvasElement;
  ctx = playerCanvas.getContext("2d");
  playerCanvasBoundingBox = playerCanvas.getBoundingClientRect();
});

// new position from mouse event
let canvasPos = { x: 0, y: 0 };

const updateCanvasPosition = (event: MouseEvent) => {
  canvasPos.x = event.clientX - playerCanvasBoundingBox.x;
  canvasPos.y = event.clientY - playerCanvasBoundingBox.y;
};

const drawLineOnCanvas = (event: MouseEvent) => {
  const MOUSE_PRIMARY_BUTTON = 1;

  if (event.buttons !== MOUSE_PRIMARY_BUTTON) {
    return;
  }

  let lastCanvasPos = Object.assign({}, { ...canvasPos });
  updateCanvasPosition(event);
  drawOnCanvas(lastCanvasPos.x, lastCanvasPos.y, canvasPos.x, canvasPos.y);
};

const drawDotOnCanvas = (event: MouseEvent) => {
  updateCanvasPosition(event);
  drawOnCanvas(canvasPos.x, canvasPos.y, canvasPos.x, canvasPos.y);
};

const drawOnCanvas = async (x0: number, y0: number, x1: number, y1: number) => {
  if (!ctx) {
    return;
  }

  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#ff0000";

  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
};

const clearCanvasDrawing = () => {
  ctx?.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
  renderPlayerSkinToCanvas();

  setTimeout(async () => {
    await setPlayerTextureByCanvas(playerCanvas);
  }, 40);
};
</script>

<template>
  <div class="bg-gray-100 border-b border-gray-300">
    <div class="bg-white shadow">
      <div class="container">
        <div class="font-bold text-xl py-4">Player Skin Editor</div>
      </div>
    </div>

    <div class="container fadeIn my-4">
      <div class="flex grow">
        <div class="grid grid-cols-10 gap-4 w-full">
          <div
            class="bg-gradient-to-b from-transparent via-white border-2 col-span-3"
          >
            <model-viewer
              id="PlayerViewer"
              :src="`${baseUrl}/assets/models/playerout.gltf`"
              camera-controls
              disable-zoom
              interaction-prompt="none"
              max-camera-orbit="auto 360deg 100"
              min-camera-orbit="auto 0deg auto"
              orientation="270deg 270deg 0deg"
              rotation-per-second="5deg"
              @load="renderPlayerSkinToCanvas"
            >
            </model-viewer>
          </div>
          <div
            class="col-span-4 self-center"
            style="width: 512px"
            @drop="handleDrop"
            @dragover.prevent
          >
            <canvas
              id="PlayerCanvas"
              class="border bg-white cursor-crosshair"
              height="386"
              width="512"
              @mouseup="updatePlayerTexture"
              @mousedown="drawDotOnCanvas"
              @mouseenter="updateCanvasPosition"
              @mousemove="drawLineOnCanvas"
            ></canvas>
            <img
              id="PlayerImage"
              :src="store.skinTextureURI"
              alt="Player Skin"
              class="hidden"
            />

            <div class="p-2 bg-gray-300">
              <button
                class="border border-gray-400 hover:bg-red-100 rounded p-2 bg-gray-100 shadow"
                @click="clearCanvasDrawing"
              >
                Clear drawing
              </button>
            </div>
          </div>

          <div class="col-span-3 ml-8">
            <div class="space-y-4">
              <div class="flex items-center">
                <div class="text-lg font-bold">Settings</div>
              </div>
              <hr />
              <div class="flex items-center">
                <div class="w-32"><strong>Custom skin</strong></div>
                <input
                  id="custom_skin"
                  type="file"
                  @change="handleCustomSkinChange"
                />
              </div>
              <hr />
              <div>foo</div>
              <hr />
              <div>foo</div>
              <hr />
              <div>foo</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
