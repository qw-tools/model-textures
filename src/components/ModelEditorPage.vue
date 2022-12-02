<script lang="ts" setup>
import ViewerAndTextureEditors from "./ViewerAndTextureEditors.vue";
import BrushSettings from "./BrushSettings.vue";
import { Brush, getDefaultBrush } from "../pkg/konva/Brush";
import FilterToolbar from "./FilterToolbar.vue";
import { Item } from "../pkg/quake/Item";
import { CssFilterSettings } from "../pkg/CssFilter";
import { EditorEvent } from "./events";

//const previewHeight = 240;

interface Props {
  title: string;
  editorHeight: number;
  items: Item[];
}

const props = defineProps<Props>();

function onBrushChange(brush: Brush): void {
  const event = new CustomEvent(EditorEvent.BRUSH_CHANGE, {
    bubbles: true,
    detail: { brush },
  });
  document.dispatchEvent(event);
}

function onFiltersChange(filters: CssFilterSettings): void {
  const event = new CustomEvent(EditorEvent.FILTERS_CHANGE, {
    bubbles: true,
    detail: { filters },
  });
  document.dispatchEvent(event);
}
</script>
<template>
  <div class="bg-gray-100 border-b border-gray-300">
    <div class="bg-white shadow">
      <div class="container">
        <h1 class="font-bold text-xl py-4">{{ props.title }}</h1>
      </div>
    </div>

    <div class="container fadeIn my-4">
      <div
        class="flex px-4 py-3 my-4 items-center rounded border shadow bg-white space-x-8"
      >
        <BrushSettings :brush="getDefaultBrush()" :on-change="onBrushChange" />
        <FilterToolbar :on-change="onFiltersChange" />
      </div>

      <div class="grid gap-4 grid-cols-1">
        <ViewerAndTextureEditors
          v-for="item in props.items"
          :item="item"
          :key="item.id"
          :editor-height="props.editorHeight"
        />
      </div>
    </div>
  </div>
</template>
