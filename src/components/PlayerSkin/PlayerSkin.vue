<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import PlayerBrushSettings from "./PlayerBrushSettings.vue";
import { BrushSettings, PlayerTextureEditor, QuakeModelViewer } from "./types";

const baseUrl = import.meta.env.BASE_URL;
const defaultModel = `${baseUrl}/assets/models/playerout.gltf`;
const defaultTextureURI = `${baseUrl}/assets/models/playerout0_tex00.png`;

interface PlayerSkinStore {
  brushSettings: BrushSettings;
}

const store: PlayerSkinStore = reactive({
  brushSettings: {
    color: "#ff0000",
    size: 24,
    shape: "round",
  },
});

async function onTextureFileDrop(event: DragEvent): Promise<void> {
  // prevent opening image in browser
  event.stopPropagation();
  event.preventDefault();

  if (!event.dataTransfer) {
    return;
  }

  await editor.setTextureByFile(event.dataTransfer.files[0]);
}

async function onTextureFileUpload(event: Event): Promise<void> {
  const files = (event.target as HTMLInputElement).files;

  if (!files) {
    return;
  }

  await editor.setTextureByFile(files[0]);
}

let viewer: QuakeModelViewer;
let editor: PlayerTextureEditor;

async function onEditorChange(): Promise<void> {
  await viewer?.setTextureByURI(editor.toURI());
}

onMounted(async () => {
  editor = new PlayerTextureEditor({
    containerID: "PlayerTextureEditor",
    width: 512,
    height: 336,
    onChange: onEditorChange,
  });
  await editor.setTextureByURI(defaultTextureURI);
});

async function onViewerLoaded(): Promise<void> {
  viewer = new QuakeModelViewer("PlayerModelViewer");
  await onEditorChange();
}
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
              id="PlayerModelViewer"
              :src="defaultModel"
              camera-controls
              disable-zoom
              disable-tap
              max-camera-orbit="auto 360deg 100"
              min-camera-orbit="auto 0deg auto"
              orientation="270deg 270deg 0deg"
              rotation-per-second="5deg"
              @load="onViewerLoaded"
            >
            </model-viewer>
          </div>
          <div
            class="col-span-4 self-center"
            style="width: 512px"
            @drop="onTextureFileDrop"
            @dragover.prevent
          >
            <div class="border bg-white">
              <div id="PlayerTextureEditor" />
            </div>

            <div class="p-2 bg-gray-300 flex items-center space-x-4">
              <button
                class="block border border-gray-400 hover:bg-red-100 rounded py-2 bg-gray-100 shadow w-40 text-sm"
                @click="editor.clearPainting"
              >
                Clear drawing
              </button>
              <PlayerBrushSettings v-model="store.brushSettings" />
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
                  @change="onTextureFileUpload"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
