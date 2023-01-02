<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from "vue";
import { Items } from "../../pkg/quake/items";
import { itemToViewerSettings, ModelViewer } from "../../pkg/ModelViewer";
import { Texture } from "../../pkg/quake/models";
import { itemToEditorSettings, TextureEditor } from "./pixi/TextureEditor";
import { Brush } from "./pixi/brush";
import { FilterInputs } from "./pixi/filter";

interface Props {
  item: Items;
  filters: FilterInputs;
  brush: Brush;
}

const props = defineProps<Props>();

let viewer: ModelViewer;
const viewerSettings = itemToViewerSettings(props.item);

const editors: TextureEditor[] = new Array(
  props.item.model.textures.length
).fill(null);
const editorSettings = itemToEditorSettings(props.item);

onMounted(async () => {
  // viewer
  viewer = new ModelViewer(viewerSettings);

  // editors
  for (let i = 0; i < props.item.model.textures.length; i++) {
    const texture: Texture = props.item.model.textures[i];
    const settings = editorSettings[i];

    editors[i] = new TextureEditor({
      ...settings,
      onChange: () => {
        viewer.setTextureByURI(editors[i].toDataUrl(), texture.index);
      },
      onReady: () => {
        editors[i].brush = props.brush;
      },
    });

    document
      .getElementById(settings.containerID)
      ?.append(editors[i].getCanvas());
  }
});

onBeforeUnmount(() => {
  for (let i = 0; i < editors.length; i++) {
    editors[i].destroy();
  }
});
</script>

<template>
  <div class="flex">
    <div class="app-border-dashed" style="width: 370px">
      <model-viewer
        :id="viewerSettings.containerID"
        :orientation="`270deg 270deg ${props.item.viewerOrientation}deg`"
        camera-controls
        disable-pan
        disable-tap
        disable-zoom
        interaction-prompt="none"
        loading="eager"
        max-camera-orbit="auto 360deg 100"
        min-camera-orbit="auto 0deg auto"
        rotation-per-second="5deg"
      >
      </model-viewer>
    </div>
    <div class="flex">
      <div
        v-for="(editorSetting, index) in editorSettings"
        :key="editorSetting.containerID"
        class="px-6 border-l border-l-gray-300 first:border-l-0"
      >
        <div class="my-2 flex items-center space-x-4">
          <div class="text-sm font-mono">
            {{ props.item.model.textures[index].filename }}
            [{{ props.item.model.textures[index].width }}x{{
              props.item.model.textures[index].height
            }}]
          </div>

          <button
            class="block border border-gray-400 hover:bg-blue-100 rounded-md py-1.5 px-3 bg-sky-100 shadow text-sm ml-auto"
            @click="
              () =>
                editors[index]?.download(
                  props.item.model.textures[index].filename
                )
            "
          >
            Download
          </button>
        </div>

        <div
          :style="`width: ${editorSetting.width + 4}px; height: ${
            editorSetting.height + 4
          }px`"
          class="app-border-dashed app-checker"
        >
          <div :id="`${editorSetting.containerID}`" />
        </div>

        <div class="flex mt-2 space-x-4">
          <button
            class="block border border-gray-400 hover:bg-red-100 rounded-md py-1 px-2 bg-gray-200 shadow text-sm"
            @click="() => editors[index]?.paint.clear()"
          >
            Clear paint
          </button>
          <label class="flex items-center">
            <input
              type="checkbox"
              @click="() => editors[index]?.toggleOutline()"
            />
            <strong class="text-sm">Show outline</strong>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>