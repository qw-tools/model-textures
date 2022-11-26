<script lang="ts" setup>
import { onMounted, reactive, watch } from "vue";
import { QuakeModelViewer } from "../../components/QuakeModelViewer";
import { TextureEditor } from "../../components/TextureEditor";
import PlayerBrushSettings from "../../components/PlayerSkin/PlayerBrushSettings.vue";
import { BrushSettings, getDefaultBrushSettings } from "../../components/Brush";
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
  brushSettings: BrushSettings;
  filterSettings: FilterSettings;
}

const store: PlayerSkinStore = reactive({
  brushSettings: getDefaultBrushSettings(),
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
    editor.setTextureByURI(model.defaultTexturePath);
    editor.textureOutline.hide();

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

function onFilterSettingsChange(newFilterSettings: FilterSettings): void {
  for (let i = 0; i < editors.length; i++) {
    editors[i].setFilterSettings(newFilterSettings);
  }
}

watch(store.brushSettings, onBrushSettingsChange);
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
        <PlayerBrushSettings
          :settings="store.brushSettings"
          :on-change="onBrushSettingsChange"
        />

        <div class="flex items-center space-x-2">
          <label>
            <input type="checkbox" v-model="store.filterSettings.hue.enabled" />
            <strong>HUE</strong>
          </label>
          <input
            type="range"
            :disabled="!store.filterSettings.hue.enabled"
            :min="store.filterSettings.hue.min"
            :max="store.filterSettings.hue.max"
            v-model.number="store.filterSettings.hue.value"
            class="w-24"
          />
          <!--          <label>-->
          <!--            <input-->
          <!--              type="checkbox"-->
          <!--              v-model="store.filterSettings.grayscale.enabled"-->
          <!--            />-->
          <!--            <strong>Colorize</strong>-->
          <!--          </label>-->
        </div>

        <div class="flex items-center space-x-2">
          <label>
            <input
              type="checkbox"
              v-model="store.filterSettings.saturation.enabled"
            />
            <strong>Saturation</strong>
          </label>
          <input
            type="range"
            :disabled="!store.filterSettings.saturation.enabled"
            :min="store.filterSettings.saturation.min"
            :max="store.filterSettings.saturation.max"
            :step="store.filterSettings.saturation.max / 100"
            v-model.number="store.filterSettings.saturation.value"
            class="w-24"
          />
        </div>

        <div class="flex items-center space-x-2">
          <label>
            <input
              type="checkbox"
              v-model="store.filterSettings.brightness.enabled"
            />
            <strong>Brightness</strong>
          </label>
          <input
            type="range"
            :disabled="!store.filterSettings.brightness.enabled"
            :min="store.filterSettings.brightness.min"
            :max="store.filterSettings.brightness.max"
            :step="0.1"
            v-model.number="store.filterSettings.brightness.value"
            class="w-24"
          />
        </div>

        <div class="flex items-center space-x-2">
          <label>
            <input
              type="checkbox"
              v-model="store.filterSettings.blur.enabled"
            />
            <strong>Blur</strong>
          </label>
          <input
            type="range"
            :disabled="!store.filterSettings.blur.enabled"
            :min="store.filterSettings.blur.min"
            :max="store.filterSettings.blur.max"
            :step="1"
            v-model.number="store.filterSettings.blur.value"
            class="w-24"
          />
        </div>
      </div>

      <div class="grid gap-2 lg:grid-cols-2 xl:grid-cols-3">
        <div v-for="(m, index) in models" class="flex" :key="m.id">
          <div
            style="width: 50%; height: 240px"
            class="border-2 border-dashed border-black/20"
          >
            <model-viewer
              :id="m.viewerID"
              :src="m.modelPath"
              auto-rotate
              camera-controls
              disable-pan
              disable-tap
              disable-zoom
              :interaction-prompt="0 === index ? 'auto' : 'none'"
              max-camera-orbit="auto 360deg 100"
              min-camera-orbit="auto 0deg auto"
              orientation="0deg 270deg -45deg"
              rotation-per-second="7deg"
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
