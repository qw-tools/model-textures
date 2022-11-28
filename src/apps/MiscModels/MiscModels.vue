<script lang="ts" setup>
import { onMounted } from "vue";
import { QuakeModelViewer } from "../../components/QuakeModelViewer";
import { TextureEditor } from "../../konva/TextureEditor";
import BrushSettings from "../../components/BrushSettings.vue";
import FilterToolbar from "../../components/FilterToolbar.vue";
import { Brush, getDefaultBrush } from "../../konva/Brush";
import { FilterSettings } from "../../konva/Filter";
import { publicUrl } from "../../components/util";
import { EditorAndViewerSettings } from "../ArmorModels/EditorAndViewer";

const preferredEditorHeight = 180;

const setups: EditorAndViewerSettings[] = [
  {
    modelName: "grenade",
    width: 40,
    height: 44,
    scale: preferredEditorHeight / 44,
  },
  {
    modelName: "missile",
    width: 288,
    height: 195,
    scale: preferredEditorHeight / 195,
  },
  {
    modelName: "quaddama",
    width: 308,
    height: 121,
    scale: preferredEditorHeight / 121,
  },
  {
    modelName: "invulner",
    width: 308,
    height: 67,
    scale: preferredEditorHeight / 67,
  },
].map((settings) => ({
  editor: {
    containerID: `Editor_${settings.modelName}`,
    texturePath: publicUrl(
      `/assets/models/${settings.modelName}out0_tex00.png`
    ),
    width: settings.width * settings.scale,
    height: settings.height * settings.scale,
  },
  viewer: {
    containerID: `Viewer_${settings.modelName}`,
    modelPath: publicUrl(`/assets/models/${settings.modelName}out.gltf`),
  },
}));

const viewers: QuakeModelViewer[] = [];
const editors: TextureEditor[] = [];

onMounted(() => {
  for (let i = 0; i < setups.length; i++) {
    const setup = setups[i];

    const viewer = new QuakeModelViewer(setup.viewer);
    viewers.push(viewer);

    const editor = new TextureEditor({
      ...setup.editor,
      onChange: () => {
        viewer.setTextureByURI(editor.toURI());
      },
    });
    editor.modelTextureOutline.hide();
    editors.push(editor);
  }
});

function onBrushChange(newSettings: Brush): void {
  for (let i = 0; i < editors.length; i++) {
    editors[i].brush = newSettings;
  }
}

function onFiltersChange(newFilterSettings: FilterSettings): void {
  for (let i = 0; i < editors.length; i++) {
    editors[i].applyFilters(newFilterSettings);
  }
}
</script>
<template>
  <div class="bg-gray-100 border-b border-gray-300">
    <div class="bg-white shadow">
      <div class="container">
        <h1 class="font-bold text-xl py-4">Misc models texture editor</h1>
      </div>
    </div>

    <div class="container fadeIn my-4">
      <div
        class="flex px-4 py-3 my-4 items-center rounded border shadow bg-white space-x-8"
      >
        <BrushSettings :brush="getDefaultBrush()" :on-change="onBrushChange" />
        <FilterToolbar :on-change="onFiltersChange" />
      </div>

      <div class="grid gap-2 lg:grid-cols-1">
        <div
          v-for="(setup, index) in setups"
          :key="setup.viewer.modelPath"
          class="flex"
        >
          <div
            class="border-2 border-dashed border-black/20"
            style="width: 480px; height: 240px"
          >
            <model-viewer
              :id="setup.viewer.containerID"
              :interaction-prompt="0 === index ? 'auto' : 'none'"
              auto-rotate
              camera-controls
              disable-pan
              disable-tap
              disable-zoom
              max-camera-orbit="auto 360deg 100"
              min-camera-orbit="auto 0deg auto"
              orientation="0deg 270deg -45deg"
              rotation-per-second="7deg"
            >
            </model-viewer>
          </div>

          <div class="border bg-gray-200">
            <div :id="setup.editor.containerID" />

            <div class="p-2 bg-gray-300 flex items-center space-x-4">
              <button
                class="block border border-gray-400 hover:bg-red-100 rounded px-2 py-1 bg-gray-100 shadow text-sm"
                @click="editors[index]?.clearPaint()"
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
