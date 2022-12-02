<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from "vue";
import { Item, itemToEditorSettings, itemToViewerSettings } from "./Item";
import { ModelViewer } from "../../pkg/ModelViewer";
import { TextureEditor } from "../../pkg/konva/TextureEditor";
import { EditorEvent } from "./events";
import { Texture } from "../../pkg/quake/models";
import { CssFilterSettings } from "../../pkg/CssFilter";
import { Brush } from "../../pkg/konva/Brush";

interface Props {
  item: Item;
  editorHeight: number;
  filters: CssFilterSettings;
  brush: Brush;
}

const props = withDefaults(defineProps<Props>(), {
  editorHeight: 240,
});

let viewer: ModelViewer;
const viewerSettings = itemToViewerSettings(props.item);

const editors: TextureEditor[] = new Array(
  props.item.model.textures.length
).fill(null);
const editorSettings = itemToEditorSettings(props.item, props.editorHeight);

onMounted(async () => {
  viewer = new ModelViewer(viewerSettings);

  for (let i = 0; i < props.item.model.textures.length; i++) {
    const texture: Texture = props.item.model.textures[i];
    editors[i] = new TextureEditor({
      ...editorSettings[i],
      filters: props.filters,
      brush: props.brush,
      onChange: () => {
        viewer.setTextureByURI(editors[i].toURI(), texture.index);
      },
    });
    editors[i].modelTextureOutline.hide();
  }

  document.addEventListener(EditorEvent.BRUSH_CHANGE, onBrushChangeEvent);
  document.addEventListener(EditorEvent.FILTERS_CHANGE, onFiltersChangeEvent);
});

function onFiltersChangeEvent(e: Event): void {
  const event = e as CustomEvent;

  for (let i = 0; i < editors.length; i++) {
    editors[i].applyCSSFilters(event.detail.filters);
  }
}

const onBrushChangeEvent = (e: Event) => {
  const event = e as CustomEvent;

  for (let i = 0; i < editors.length; i++) {
    editors[i].brush = event.detail.brush;
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
  <div class="grid grid-cols-9 gap-4 w-full">
    <div class="col-span-3 app-border-dashed">
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
    <div
      v-for="(editorSetting, index) in editorSettings"
      :key="editorSetting.containerID"
      class="col-span-3"
    >
      <div
        :style="`width: ${editorSetting.width + 4}px; height: ${
          editorSetting.height + 4
        }px`"
        class="app-border-dashed"
      >
        <div :id="editorSetting.containerID" />
      </div>

      <div class="p-2 bg-gray-300 flex items-center">
        <button
          class="block border border-gray-400 hover:bg-red-100 rounded-md py-2 px-3 bg-gray-100 shadow text-sm"
          @click="() => editors[index]?.clearPaint()"
        >
          Clear
        </button>

        <button
          class="block border border-gray-400 hover:bg-blue-100 rounded-md py-2 px-3 bg-gray-100 shadow text-sm ml-2"
          @click="
            () =>
              editors[index]?.download(
                props.item.model.textures[index].filename
              )
          "
        >
          Download
        </button>

        <label class="flex items-center ml-4">
          <input
            type="checkbox"
            @click="() => editors[index]?.toggleTextureOutline()"
          />
          <strong class="text-sm">Show texture outline</strong>
        </label>

        <div class="ml-auto text-xs font-mono">
          {{ props.item.model.textures[index].filename }}
          {{ props.item.model.textures[index].width }}x{{
            props.item.model.textures[index].height
          }}
        </div>
      </div>
    </div>
  </div>
</template>
