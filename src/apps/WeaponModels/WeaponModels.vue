<script lang="ts" setup>
import { onMounted, reactive, watch } from "vue";
import { QuakeModelViewer } from "../../components/PlayerSkin/QuakeModelViewer";
import { TextureEditor } from "../../components/PlayerSkin/TextureEditor";
import PlayerBrushSettings from "../../components/PlayerSkin/PlayerBrushSettings.vue";
import {
  BrushSettings,
  getDefaultBrushSettings,
} from "../../components/PlayerSkin/Brush";

function stripTrailingSlash(str: string): string {
  return str.endsWith("/") ? str.slice(0, -1) : str;
}

const baseUrl = stripTrailingSlash(import.meta.env.BASE_URL);
const models = [
  "g_shot",
  "g_nail",
  "g_nail2",
  "g_rock",
  "g_rock2",
  "g_light",
].map((name) => ({
  id: name,
  editorID: `Editor_${name}`,
  viewerID: `Viewer_${name}`,
  modelPath: `${baseUrl}/assets/models/${name}out.gltf`,
  defaultTexturePath: `${baseUrl}/assets/models/${name}out0_tex00.png`,
}));

interface PlayerSkinStore {
  brushSettings: BrushSettings;
}

const store: PlayerSkinStore = reactive({
  brushSettings: getDefaultBrushSettings(),
});

let viewers: QuakeModelViewer[] = [];
let editors: TextureEditor[] = [];

onMounted(() => {
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const viewer = new QuakeModelViewer(model.viewerID);

    const editor = new TextureEditor({
      containerID: model.editorID,
      width: 320,
      height: 240,
      onChange: () => {
        viewer.setTextureByURI(editor.toURI());
      },
    });
    editor.setTextureByURI(model.defaultTexturePath);

    viewers.push(viewer);
    editors.push(editor);
  }
});

async function onBrushSettingsChange(
  newSettings: BrushSettings
): Promise<void> {
  for (let i = 0; i < editors.length; i++) {
    editors[i].brush = newSettings;
  }
}

watch(store.brushSettings, onBrushSettingsChange);
</script>
<template>
  <div class="bg-gray-100 border-b border-gray-300">
    <div class="bg-white shadow">
      <div class="container">
        <h1 class="font-bold text-xl py-4">Weapon models texture editor</h1>
      </div>
    </div>

    <div class="container fadeIn my-4">
      <div class="px-4 py-3 my-4 rounded border shadow bg-white">
        <PlayerBrushSettings v-model="store.brushSettings" />
      </div>

      <div class="grid grid-cols-3">
        <div v-for="(m, index) in models" class="border bg-white shadow flex">
          <div style="width: 50%; height: 240px">
            <model-viewer
              :id="m.viewerID"
              :src="m.modelPath"
              camera-controls
              disable-pan
              disable-tap
              disable-zoom
              :interaction-prompt="0 === index ? 'auto' : 'none'"
              max-camera-orbit="auto 360deg 100"
              min-camera-orbit="auto 0deg auto"
              orientation="270deg 270deg 0deg"
              rotation-per-second="5deg"
            >
            </model-viewer>
          </div>

          <div class="border bg-white">
            <div :id="m.editorID" />

            <div class="p-2 bg-gray-300 flex items-center space-x-4">
              <button
                class="block border border-gray-400 hover:bg-red-100 rounded px-2 py-1 bg-gray-100 shadow text-sm"
                @click="editors[index]?.clearPainting()"
              >
                Clear drawing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
