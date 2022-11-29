<script lang="ts" setup>
import { onMounted } from "vue";
import BrushSettings from "../../components/BrushSettings.vue";
import { TextureEditor } from "../../konva/TextureEditor";
import { ModelViewer } from "../../components/ModelViewer";
import { Brush, getDefaultBrush } from "../../konva/Brush";
import { EditorAndViewerSettings } from "../ArmorModels/EditorAndViewer";
import { player } from "../../quake/Item";

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

const item = player;
const setup: EditorAndViewerSettings = {
  editor: {
    containerID: `Editor_${item.id}`,
    texturePath: item.model.texture.path,
    width: 2 * item.model.texture.width,
    height: 2 * item.model.texture.height,
  },
  viewer: {
    containerID: `Viewer_${item.id}`,
    modelPath: item.model.path,
    texturePath: item.model.texture.path,
  },
};

let viewer: ModelViewer;
let editor: TextureEditor;

onMounted(async () => {
  viewer = new ModelViewer(setup.viewer);

  editor = new TextureEditor({
    ...setup.editor,
    onChange: () => {
      viewer.setTextureByURI(editor.toURI());
    },
  });
  editor.modelTextureOutline.hide();
});

function onBrushChange(newSettings: Brush): void {
  editor.brush = newSettings;
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
          <div class="col-span-3 app-border-dashed">
            <model-viewer
              :id="setup.viewer.containerID"
              camera-controls
              disable-pan
              disable-tap
              disable-zoom
              max-camera-orbit="auto 360deg 100"
              min-camera-orbit="auto 0deg auto"
              orientation="270deg 270deg 0deg"
              rotation-per-second="5deg"
            >
            </model-viewer>
          </div>
          <div class="col-span-4" @drop="onTextureFileDrop" @dragover.prevent>
            <div
              class="app-border-dashed"
              :style="`width: ${setup.editor.width + 4}px; height: ${
                setup.editor.height + 4
              }px`"
            >
              <div :id="setup.editor.containerID" />
            </div>

            <div class="p-2 bg-gray-300 flex items-center space-x-4">
              <button
                class="block border border-gray-400 hover:bg-red-100 rounded py-2 bg-gray-100 shadow w-40 text-sm"
                @click="editor.clearPaint"
              >
                Clear drawing
              </button>
              <BrushSettings
                :brush="getDefaultBrush()"
                :on-change="onBrushChange"
                class="w-full"
              />
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
              <hr />
              <div class="">
                <label class="flex items-center">
                  <input type="checkbox" @click="editor.toggleTextureOutline" />
                  <strong>Show texture outline</strong>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
