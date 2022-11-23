<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import { ModelViewerElement } from "@google/model-viewer";
import { Texture } from "@google/model-viewer/lib/features/scene-graph/texture";

const baseUrl = import.meta.env.BASE_URL;

const store = reactive({
  skinTextureURI: `${baseUrl}/assets/models/playerout0_tex00.png`,
});

const onFileDrop = (event: DragEvent) => {
  // prevent opening image in browser
  event.stopPropagation();
  event.preventDefault();

  if (!event.dataTransfer) {
    return;
  }

  setPlayerTextureByFile(event.dataTransfer.files[0]);
};

const onCustomSkinChange = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;

  if (!files) {
    return;
  }

  clearPlayerCanvas();
  setPlayerTextureByFile(files[0]);
};

const setPlayerTextureByFile = async (file: File) => {
  const texture = await textureFromFile(file);

  if (!texture) {
    return;
  }

  clearPlayerCanvas();
  setPlayerTexture(texture);
};

const textureFromFile = async (file: File): Promise<Texture | null> => {
  const fileDataUri = await dataUriFromFile(file);
  return viewer.createTexture(fileDataUri);
};

const dataUriFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.addEventListener("load", async () => {
      resolve(reader.result as string);
    });

    reader.readAsDataURL(file);
  });
};

const setPlayerTexture = (texture: Texture) => {
  if (!viewer.model || 0 === viewer.model.materials.length) {
    return;
  }

  viewer.model.materials[0].pbrMetallicRoughness.baseColorTexture.setTexture(
    texture
  );
  store.skinTextureURI = texture.source.uri as string;
  drawPlayerImageOnPlayerCanvas();
};

const updatePlayerTexture = () =>
  setPlayerViewerModelTextureByCanvas(playerCanvas);

const setPlayerViewerModelTextureByCanvas = async (
  canvas: HTMLCanvasElement
) => {
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
let playerImage: HTMLImageElement;

const drawImageOnCanvas = (
  img: HTMLImageElement,
  canvas: HTMLCanvasElement
) => {
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    0,
    0,
    canvas.width,
    canvas.height
  );
};

const drawPlayerImageOnPlayerCanvas = () => {
  const canvasDrawTimeout = 40;
  window.setTimeout(
    () => drawImageOnCanvas(playerImage, playerCanvas),
    canvasDrawTimeout
  );
};

onMounted(() => {
  viewer = document.getElementById("PlayerViewer") as ModelViewerElement;
  playerImage = document.getElementById("PlayerImage") as HTMLImageElement;
  playerCanvas = document.getElementById("PlayerCanvas") as HTMLCanvasElement;
  ctx = playerCanvas.getContext("2d");
});

// new position from mouse event
let canvasPos = { x: 0, y: 0 };

const updatePlayerCanvasPosition = (event: MouseEvent) => {
  const boundingBox = playerCanvas.getBoundingClientRect();
  canvasPos.x = event.clientX - boundingBox.x;
  canvasPos.y = event.clientY - boundingBox.y;
};

const drawLineOnPlayerCanvas = (event: MouseEvent) => {
  const MOUSE_PRIMARY_BUTTON = 1;

  if (event.buttons !== MOUSE_PRIMARY_BUTTON) {
    return;
  }

  let lastCanvasPos = Object.assign({}, { ...canvasPos });
  updatePlayerCanvasPosition(event);
  drawOnPlayerCanvas(
    lastCanvasPos.x,
    lastCanvasPos.y,
    canvasPos.x,
    canvasPos.y
  );
};

const drawDotOnPlayerCanvas = (event: MouseEvent) => {
  updatePlayerCanvasPosition(event);
  drawOnPlayerCanvas(canvasPos.x, canvasPos.y, canvasPos.x, canvasPos.y);
};

const drawOnPlayerCanvas = async (
  x0: number,
  y0: number,
  x1: number,
  y1: number
) => {
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

const clearPlayerCanvas = () => {
  ctx?.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
};

const resetPlayerCanvas = () => {
  clearPlayerCanvas();
  drawPlayerImageOnPlayerCanvas();

  setTimeout(async () => {
    await setPlayerViewerModelTextureByCanvas(playerCanvas);
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
              disable-tap
              max-camera-orbit="auto 360deg 100"
              min-camera-orbit="auto 0deg auto"
              orientation="270deg 270deg 0deg"
              rotation-per-second="5deg"
              @load="drawPlayerImageOnPlayerCanvas"
            >
            </model-viewer>
          </div>
          <div
            class="col-span-4 self-center"
            style="width: 512px"
            @drop="onFileDrop"
            @dragover.prevent
          >
            <canvas
              id="PlayerCanvas"
              class="border bg-white cursor-crosshair"
              height="386"
              width="512"
              @mousedown="drawDotOnPlayerCanvas"
              @mouseenter="updatePlayerCanvasPosition"
              @mousemove="drawLineOnPlayerCanvas"
              @mouseup="updatePlayerTexture"
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
                @click="resetPlayerCanvas"
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
                  @change="onCustomSkinChange"
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
