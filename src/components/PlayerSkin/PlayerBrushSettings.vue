<script lang="ts" setup>
import { BrushSettings } from "../Brush";
import { reactive, watch } from "vue";
import { throttle } from "@google/model-viewer/lib/utilities";

interface Props {
  settings: BrushSettings;
  onChange: (settings: BrushSettings) => void;
}

const props = defineProps<Props>();

const store = reactive<BrushSettings>({
  ...props.settings,
});

watch(store, throttle(props.onChange, 50));
</script>
<template>
  <div class="flex items-center">
    <strong class="mr-2">Brush</strong>
    <div class="flex space-x-4 mr-4">
      <input type="color" v-model="store.color" />
    </div>

    <div class="items-center flex mr-4">
      <input
        type="range"
        min="1"
        max="32"
        class="w-20"
        v-model.number="store.size"
      />
      <span class="text-sm ml-2">{{ store.size }}px</span>
    </div>

    <div class="text-xs">
      <label
        ><input type="radio" value="round" v-model="store.shape" />
        Circle</label
      ><br />
      <label
        ><input type="radio" value="square" v-model="store.shape" />
        Square</label
      >
    </div>

    <div
      class="flex items-center justify-center border border-gray-400 w-10 h-10 ml-4"
    >
      <div
        :class="store.shape === 'round' ? 'rounded-full' : ''"
        :style="`background-color: ${store.color}; width: ${store.size}px; height: ${store.size}px`"
      ></div>
    </div>
  </div>
</template>
