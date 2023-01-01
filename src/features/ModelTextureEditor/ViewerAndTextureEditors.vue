<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from "vue";
import { Item, itemToEditorSettings, itemToViewerSettings } from "./Item";
import { ModelViewer } from "../../pkg/ModelViewer";
import { Texture } from "../../pkg/quake/models";
import { CssFilterSettings } from "../../pkg/CssFilter";
import { PixiTextureEditor } from "./pixi/PixiTextureEditor";
import { Brush, EditorEvent } from "./pixi/types";

interface Props {
  item: Item;
  filters: CssFilterSettings;
  brush: Brush;
}

const props = defineProps<Props>();

let viewer: ModelViewer;
const viewerSettings = itemToViewerSettings(props.item);

const editors: PixiTextureEditor[] = new Array(
  props.item.model.textures.length
).fill(null);
const outlines: TextureOutLine[] = new Array(
  props.item.model.textures.length
).fill(null);
const editorSettings = itemToEditorSettings(props.item);

onMounted(async () => {
  // viewer
  const viewerPromise = new Promise<void>((resolve) => {
    viewer = new ModelViewer({
      ...viewerSettings,
      onLoad: resolve,
    });
  });

  // editors
  const editorPromises: Promise<void>[] = [];

  for (let i = 0; i < props.item.model.textures.length; i++) {
    const editorPromise = new Promise<void>((resolve) => {
      const texture: Texture = props.item.model.textures[i];

      editors[i] = new PixiTextureEditor({
        height: editorSettings[i].height,
        width: editorSettings[i].width,
        texturePath: editorSettings[i].texturePath,
        onChange: () => {
          viewer.setTextureByURI(editors[i].toDataUrl(), texture.index);
        },
        onReady: () => resolve(),
      });

      const pixiElement = document.getElementById(
        editorSettings[i].containerID
      );
      if (!pixiElement) {
        return;
      }
      pixiElement.append(editors[i].view as HTMLCanvasElement);
    });

    editorPromises.push(editorPromise);
  }

  // wait until viewer and all texture editors are ready
  const allPromises = [viewerPromise].concat(editorPromises);
  await Promise.all(allPromises);

  // apply textures
  for (let i = 0; i < props.item.model.textures.length; i++) {
    // const texture: Texture = props.item.model.textures[i];
    // await viewer.setTextureByURI(editors[i].toURI(), texture.index);
  }

  // events
  document.addEventListener(EditorEvent.BRUSH_CHANGE, onBrushChangeEvent);
  document.addEventListener(EditorEvent.FILTERS_CHANGE, onFiltersChangeEvent);
});

function onFiltersChangeEvent(e: Event): void {
  const event = e as CustomEvent;

  console.log(event.detail.filters);

  for (let i = 0; i < editors.length; i++) {
    //editors[i].applyCSSFilters(event.detail.filters);
  }
}

const onBrushChangeEvent = (e: Event) => {
  const event = e as CustomEvent;

  for (let i = 0; i < editors.length; i++) {
    editors[i].paintLayer.brush = event.detail.brush;
  }
};

onBeforeUnmount(() => {
  document.removeEventListener(EditorEvent.BRUSH_CHANGE, onBrushChangeEvent);
  document.removeEventListener(
    EditorEvent.FILTERS_CHANGE,
    onFiltersChangeEvent
  );
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
            @click="() => editors[index]?.paintLayer.clear()"
          >
            Clear paint
          </button>
          <label class="flex items-center">
            <input
              type="checkbox"
              checked
              @click="() => editors[index]?.toggleOutline()"
            />
            <strong class="text-sm">Show outline</strong>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>