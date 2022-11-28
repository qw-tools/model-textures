<script lang="ts" setup>
import { onMounted } from "vue";
import { QuakeModelViewer } from "../../components/QuakeModelViewer";
import { TextureEditor } from "../../konva/TextureEditor";
import BrushSettings from "../../components/BrushSettings.vue";
import FilterToolbar from "../../components/FilterToolbar.vue";
import { Brush, getDefaultBrush } from "../../konva/Brush";
import { FilterSettings } from "../../konva/Filter";
import { publicUrl } from "../../components/viteutil";

interface Model {
  id: string;
  editorID: string;
  viewerID: string;
  modelPath: string;
  defaultTexturePath: string;
}

const baseUrl = stripTrailingSlash(import.meta.env.BASE_URL);
const models: Model[] = [
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
  modelPath: publicUrl(`/assets/models/${name}out.gltf`),
  defaultTexturePath: publicUrl(`/assets/models/${name}out0_tex00.png`),
}));

const viewers: QuakeModelViewer[] = [];
const editors: TextureEditor[] = [];

onMounted(() => {
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const viewer = new QuakeModelViewer(model.viewerID);

    const editor = new TextureEditor({
      containerID: model.editorID,
      defaultTexture: model.defaultTexturePath,
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
        <h1 class="font-bold text-xl py-4">Weapon models texture editor</h1>
      </div>
    </div>

    <div class="container fadeIn my-4">
      <div
        class="flex px-4 py-3 my-4 items-center rounded border shadow bg-white space-x-8"
      >
        <BrushSettings :brush="getDefaultBrush()" :on-change="onBrushChange" />
        <FilterToolbar :on-change="onFiltersChange" />
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
