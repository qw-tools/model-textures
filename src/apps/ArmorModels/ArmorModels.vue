<script lang="ts" setup>
import { onMounted } from "vue";
import { QuakeModelViewer } from "../../components/QuakeModelViewer";
import { TextureEditor } from "../../konva/TextureEditor";
import BrushSettings from "../../components/BrushSettings.vue";
import { Brush, getDefaultBrush } from "../../konva/Brush";
import { FilterSettings } from "../../konva/Filter";
import FilterToolbar from "../../components/FilterToolbar.vue";
import { publicUrl } from "../../components/util";
import { EditorAndViewerSettings } from "./EditorAndViewer";

const textures = ["armorout0_tex00", "armorout0_tex01", "armorout0_tex02"];
const setups: EditorAndViewerSettings[] = textures.map((texture) => ({
  editor: {
    containerID: `Editor_${texture}`,
    texturePath: publicUrl(`/assets/models/${texture}.png`),
    width: 368,
    height: 152,
  },
  viewer: {
    containerID: `Viewer_${texture}`,
    modelPath: publicUrl("/assets/models/armorout.gltf"),
    texturePath: publicUrl(`/assets/models/${texture}.png`),
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

function onBrushChange(newBrush: Brush): void {
  for (let i = 0; i < editors.length; i++) {
    editors[i].brush = newBrush;
  }
}

function onFiltersChange(newFilters: FilterSettings): void {
  for (let i = 0; i < editors.length; i++) {
    editors[i].applyFilters(newFilters);
  }
}
</script>
<template>
  <div class="bg-gray-100 border-b border-gray-300">
    <div class="bg-white shadow">
      <div class="container">
        <h1 class="font-bold text-xl py-4">Armor models texture editor</h1>
      </div>
    </div>

    <div class="container fadeIn my-4">
      <div
        class="flex px-4 py-3 my-4 items-center rounded border shadow bg-white space-x-8"
      >
        <BrushSettings :brush="getDefaultBrush()" :on-change="onBrushChange" />
        <FilterToolbar :on-change="onFiltersChange" />
      </div>

      <div class="grid gap-2 grid-cols-1">
        <div
          v-for="(setup, index) in setups"
          :key="`${setup.viewer.modelPath}-${setup.viewer.texturePath}`"
          class="flex"
        >
          <div
            class="border-2 border-dashed border-black/20"
            style="width: 50%; height: 240px"
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
