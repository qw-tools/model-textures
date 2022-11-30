<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from "vue";
import {
  Item,
  itemToEditorSettings,
  itemToViewerSettings,
} from "../quake/Item";
import { ModelViewer } from "./ModelViewer";
import { TextureEditor } from "../konva/TextureEditor";
import { EditorEvent } from "./Event";

interface Props {
  item: Item;
  editorHeight: number;
}

const props = withDefaults(defineProps<Props>(), {
  editorHeight: 240,
});
const editorScale = props.editorHeight / props.item.model.texture.height;

let viewer: ModelViewer;
const viewerSettings = itemToViewerSettings(props.item);

let editor: TextureEditor;
const editorSettings = {
  ...itemToEditorSettings(props.item),
  height: props.editorHeight,
  width: props.item.model.texture.width * editorScale,
};

onMounted(async () => {
  viewer = new ModelViewer(viewerSettings);

  editor = new TextureEditor({
    ...editorSettings,
    onChange: () => {
      viewer.setTextureByURI(editor.toURI());
    },
  });
  editor.modelTextureOutline.hide();

  document.addEventListener(EditorEvent.BRUSH_CHANGE, onBrushChangeEvent);
  document.addEventListener(EditorEvent.FILTERS_CHANGE, onFiltersChangeEvent);
});

function onFiltersChangeEvent(e: Event): void {
  const event = e as CustomEvent;
  editor.applyCSSFilters(Object.values(event.detail.filters));
}

const onBrushChangeEvent = (e: Event) => {
  const event = e as CustomEvent;
  editor.brush = event.detail.brush;
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
  <div class="grid grid-cols-10 gap-4 w-full">
    <div class="col-span-3 app-border-dashed">
      <model-viewer
        :id="viewerSettings.containerID"
        camera-controls
        interaction-prompt="none"
        disable-pan
        disable-tap
        disable-zoom
        max-camera-orbit="auto 360deg 100"
        min-camera-orbit="auto 0deg auto"
        :orientation="`270deg 270deg ${props.item.viewerOrientation}deg`"
        rotation-per-second="5deg"
      >
      </model-viewer>
    </div>
    <div class="col-span-4">
      <div
        class="app-border-dashed"
        :style="`width: ${editorSettings.width + 4}px; height: ${
          editorSettings.height + 4
        }px`"
      >
        <div :id="editorSettings.containerID" />
      </div>

      <div class="p-2 bg-gray-300 flex items-center">
        <button
          class="block border border-gray-400 hover:bg-red-100 rounded-md py-2 px-3 bg-gray-100 shadow text-sm"
          @click="editor.clearPaint"
        >
          Clear drawing
        </button>

        <button
          class="block border border-gray-400 hover:bg-blue-100 rounded-md py-2 px-3 bg-gray-100 shadow text-sm ml-2"
          @click="() => editor.download(props.item.model.texture.filename)"
        >
          Download
        </button>

        <label class="flex items-center ml-4">
          <input type="checkbox" @click="editor?.toggleTextureOutline()" />
          <strong class="text-sm">Show texture outline</strong>
        </label>

        <div class="ml-auto text-xs font-mono">
          {{ props.item.model.texture.filename }}
          {{ props.item.model.texture.width }}x{{
            props.item.model.texture.height
          }}
        </div>
      </div>
    </div>
  </div>
</template>
