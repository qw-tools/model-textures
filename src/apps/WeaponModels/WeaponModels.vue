<script lang="ts" setup>
import { onMounted, reactive, watch } from "vue";
import { QuakeModelViewer } from "../../components/QuakeModelViewer";
import { TextureEditor } from "../../components/TextureEditor";
import BrushSettings from "../../components/PlayerSkin/BrushSettings.vue";
import { Brush, getDefaultBrush } from "../../components/Brush";
import {
  BlurFilterSetting,
  BrightnessFilterSetting,
  ContrastFilterSetting,
  FilterSettings,
  GrayscaleFilterSetting,
  HUEFilterSetting,
  SaturationFilterSetting,
} from "../../components/Filter";
import { throttle } from "@google/model-viewer/lib/utilities";

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
  brush: Brush;
  filterSettings: FilterSettings;
}

const store: PlayerSkinStore = reactive({
  brush: getDefaultBrush(),
  filterSettings: {
    blur: new BlurFilterSetting(),
    grayscale: new GrayscaleFilterSetting(),
    hue: new HUEFilterSetting(),
    saturation: new SaturationFilterSetting(),
    brightness: new BrightnessFilterSetting(),
    contrast: new ContrastFilterSetting(),
  },
});

const viewers: QuakeModelViewer[] = [];
const editors: TextureEditor[] = [];

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

    viewers.push(viewer);
    editors.push(editor);
  }
});

function onBrushChange(newSettings: Brush): void {
  for (let i = 0; i < editors.length; i++) {
    editors[i].paintLayer.brush = newSettings;
  }
}

function onFilterSettingsChange(newFilterSettings: FilterSettings): void {
  for (let i = 0; i < editors.length; i++) {
    editors[i].applyFilters(newFilterSettings);
  }
}

function onViewerLoaded(viewerIndex: number, model: Model) {
  editors[viewerIndex].setTextureByURI(model.defaultTexturePath);
  editors[viewerIndex].modelTextureOutline.hide();
  editors[viewerIndex].brush = store.brush;
}

watch(store.brush, onBrushChange);
watch(store.filterSettings, throttle(onFilterSettingsChange, 10));
</script>
<template>
  <div class="bg-gray-100 border-b border-gray-300">
    <div class="bg-white shadow">
      <div class="container">
        <h1 class="font-bold text-xl py-4">Weapon models texture editor</h1>
      </div>
    </div>

    <div class="container fadeIn my-4">
      <div
        class="flex px-4 py-3 my-4 items-center rounded border shadow bg-white space-x-8"
      >
        <BrushSettings :brush="store.brush" :on-change="onBrushChange" />

        <div class="flex items-center space-x-2">
          <label>
            <input v-model="store.filterSettings.hue.enabled" type="checkbox" />
            <strong>HUE</strong>
          </label>
          <input
            v-model.number="store.filterSettings.hue.value"
            :disabled="!store.filterSettings.hue.enabled"
            :max="store.filterSettings.hue.max"
            :min="store.filterSettings.hue.min"
            class="w-24"
            type="range"
          />
        </div>

        <div class="flex items-center space-x-2">
          <label>
            <input
              v-model="store.filterSettings.saturation.enabled"
              type="checkbox"
            />
            <strong>Saturation</strong>
          </label>
          <input
            v-model.number="store.filterSettings.saturation.value"
            :disabled="!store.filterSettings.saturation.enabled"
            :max="store.filterSettings.saturation.max"
            :min="store.filterSettings.saturation.min"
            :step="store.filterSettings.saturation.max / 100"
            class="w-24"
            type="range"
          />
        </div>

        <div class="flex items-center space-x-2">
          <label>
            <input
              v-model="store.filterSettings.brightness.enabled"
              type="checkbox"
            />
            <strong>Brightness</strong>
          </label>
          <input
            v-model.number="store.filterSettings.brightness.value"
            :disabled="!store.filterSettings.brightness.enabled"
            :max="store.filterSettings.brightness.max"
            :min="store.filterSettings.brightness.min"
            :step="0.1"
            class="w-24"
            type="range"
          />
        </div>

        <div class="flex items-center space-x-2">
          <label>
            <input
              v-model="store.filterSettings.blur.enabled"
              type="checkbox"
            />
            <strong>Blur</strong>
          </label>
          <input
            v-model.number="store.filterSettings.blur.value"
            :disabled="!store.filterSettings.blur.enabled"
            :max="store.filterSettings.blur.max"
            :min="store.filterSettings.blur.min"
            :step="1"
            class="w-24"
            type="range"
          />
        </div>
      </div>

      <div class="grid gap-2 lg:grid-cols-2 xl:grid-cols-3">
        <div v-for="(m, index) in models" :key="m.id" class="flex">
          <div
            class="border-2 border-dashed border-black/20"
            style="width: 50%; height: 240px"
          >
            <model-viewer
              :id="m.viewerID"
              :interaction-prompt="0 === index ? 'auto' : 'none'"
              :src="m.modelPath"
              auto-rotate
              camera-controls
              disable-pan
              disable-tap
              disable-zoom
              max-camera-orbit="auto 360deg 100"
              min-camera-orbit="auto 0deg auto"
              orientation="0deg 270deg -45deg"
              rotation-per-second="7deg"
              @load="() => onViewerLoaded(index, m)"
            >
            </model-viewer>
          </div>

          <div class="border bg-gray-200">
            <div :id="m.editorID" />

            <div class="p-2 bg-gray-300 flex items-center space-x-4">
              <button
                class="block border border-gray-400 hover:bg-red-100 rounded px-2 py-1 bg-gray-100 shadow text-sm"
                @click="editors[index]?.clearPainting()"
              >
                Clear drawing
              </button>

              <label class="flex items-center">
                <input
                  type="checkbox"
                  @click="editors[index]?.toggleTextureOutline()"
                />
                <strong class="text-sm">Show texture outline</strong>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
