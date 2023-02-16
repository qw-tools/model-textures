<script lang="ts" setup>
import SiteHeader from "@/Site/SiteHeader.vue";
import SiteFooter from "@/Site/SiteFooter.vue";
import ViewerAndTextureEditors from "./ViewerAndTextureEditors.vue";
import BrushSettings from "./BrushSettings.vue";
import { Brush, getDefaultBrush } from "@/pkg/konva/Brush";
import FilterToolbar from "./FilterToolbar.vue";
import { armors, Item } from "./Item";
import {
  CssFilterSettings,
  getDefaultFilterSettings,
} from "@/pkg/CssFilter";
import { EditorEvent } from "./events";
import { reactive } from "vue";
import ItemSelector from "./ModelSelector.vue";

interface AppStore {
  items: Item[];
  addItem: (item: Item) => void;
  removeItem: (item: Item) => void;
}

let lastBrush: Brush = getDefaultBrush();
let lastFilters: CssFilterSettings = getDefaultFilterSettings();

const store = reactive<AppStore>({
  items: [],
  addItem(item: Item): void {
    if (this.items.includes(item)) {
      const el = document.getElementById(item.id);
      if (el) {
        window.scrollTo(el.offsetLeft, el.offsetTop);
      }
    } else {
      this.items.push(item);
    }
  },
  removeItem(item: Item): void {
    const itemIndex = this.items.indexOf(item);
    if (itemIndex >= 0) {
      const el = document.getElementById(item.id);
      if (el) {
        el.style.opacity = "0";
      }
      setTimeout(() => this.items.splice(itemIndex, 1), 300);
    }
  },
});

function onBrushChange(brush: Brush): void {
  const event = new CustomEvent(EditorEvent.BRUSH_CHANGE, {
    bubbles: true,
    detail: { brush },
  });
  document.dispatchEvent(event);
  lastBrush = brush;
}

function onFiltersChange(filters: CssFilterSettings): void {
  const event = new CustomEvent(EditorEvent.FILTERS_CHANGE, {
    bubbles: true,
    detail: { filters },
  });
  document.dispatchEvent(event);
  lastFilters = filters;
}
</script>
<template>
  <SiteHeader current-app="model-textures" />

  <div class="bg-gray-100 border-b border-gray-300">
    <div class="bg-white shadow">
      <div class="container">
        <h1 class="font-bold text-xl py-4">Model Texture Editor</h1>
      </div>
    </div>

    <div class="container fadeIn my-4">
      <div
        class="flex px-4 py-3 my-4 items-center rounded border shadow bg-white space-x-8"
      >
        <BrushSettings :brush="getDefaultBrush()" :on-change="onBrushChange" />
        <FilterToolbar :on-change="onFiltersChange" />
      </div>

      <div
        v-if="0 === store.items.length"
        class="text-center py-32 app-border-dashed bg-black/5"
      >
        <strong>Click an item below to load editor</strong>, for example:
        <span
          class="hover:cursor-pointer font-bold text-sky-600 hover:text-sky-800"
          @click="() => store.addItem(armors[0])"
          >Green Armor</span
        >.
      </div>

      <div class="grid gap-6 grid-cols-1 mb-4">
        <div
          v-for="item in store.items"
          :id="item.id"
          :key="item.id"
          class="transition-opacity duration-300"
        >
          <div class="p-2 bg-gray-300 rounded-md">
            <div class="flex items-center">
              <button
                :title="`Close ${item.model.name} editor`"
                class="px-3 py-1 rounded shadow bg-gray-200 border border-gray-400 hover:bg-gray-100 mr-2"
                @click="() => store.removeItem(item)"
              >
                x
              </button>

              <div class="font-bold">
                {{ item.model.name }}
              </div>
            </div>
          </div>
          <div class="fadeIn mt-2">
            <ViewerAndTextureEditors
              :brush="lastBrush"
              :filters="lastFilters"
              :item="item"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="border-b">
    <ItemSelector :on-item-click="(item: Item) => store.addItem(item)" />
  </div>

  <SiteFooter />
</template>
