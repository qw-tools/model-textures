<script lang="ts" setup>
import SiteHeader from "../Site/SiteHeader.vue";
import SiteFooter from "../Site/SiteFooter.vue";
import ViewerAndTextureEditors from "./ViewerAndTextureEditors.vue";
import BrushSettings from "./BrushSettings.vue";
import { Brush, getDefaultBrush } from "../../pkg/konva/Brush";
import FilterToolbar from "./FilterToolbar.vue";
import { armors, Item } from "./Item";
import { CssFilterSettings } from "../../pkg/CssFilter";
import { EditorEvent } from "./events";
import { reactive } from "vue";
import ItemSelector from "./ModelSelector.vue";

interface AppStore {
  items: Item[];
  addItem: (item: Item) => void;
  removeItem: (item: Item) => void;
}

const store = reactive<AppStore>({
  items: [armors[0]],
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
  <SiteHeader current-page="index" />

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

      <div class="grid gap-4 grid-cols-1">
        <div
          v-for="item in store.items"
          :id="item.id"
          :key="item.id"
          class="flex transition-opacity duration-300"
        >
          <div class="-ml-12 mr-4">
            <button
              :title="`Remove ${item.model.name}`"
              class="py-1 px-3 rounded shadow bg-gray-300 border border-gray-400 hover:bg-gray-200"
              @click="() => store.removeItem(item)"
            >
              x
            </button>
          </div>
          <div class="fadeIn">
            <ViewerAndTextureEditors :editor-height="240" :item="item" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <ItemSelector :on-item-click="(item: Item) => store.addItem(item)" />

  <SiteFooter />
</template>
