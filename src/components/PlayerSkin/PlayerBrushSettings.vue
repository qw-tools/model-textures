<script lang="ts" setup>
import { BrushSettings } from "./types";
import { reactive } from "vue";

interface Props {
  onChange: (settings: BrushSettings) => void;
}

const props = defineProps<Props>();

const store = reactive<BrushSettings>({
  color: "#ff0000",
  size: 12,
  shape: "round",
});

const onSettingsChange = (): void => {
  props.onChange(store);
};
</script>
<template>
  <div class="flex items-center w-full">
    <strong class="mr-2">Brush</strong>
    <div class="flex space-x-4 mr-4">
      <input type="color" v-model="store.color" @change="onSettingsChange" />
    </div>

    <div class="items-center flex mr-4">
      <input
        type="range"
        min="1"
        max="32"
        class="w-20"
        v-model.number="store.size"
        @change="onSettingsChange"
      />
      <span class="text-sm ml-2">{{ store.size }}px</span>
    </div>

    <div class="text-xs">
      <label
        ><input type="radio" value="round" v-model="store.shape" />
        Rounded</label
      ><br />
      <label
        ><input type="radio" value="square" v-model="store.shape" />
        Square</label
      >
    </div>

    <div
      class="flex items-center justify-center border border-gray-400 w-10 h-10 ml-auto"
    >
      <div
        :class="store.shape === 'round' ? 'rounded-full' : ''"
        :style="`background-color: ${store.color}; width: ${store.size}px; height: ${store.size}px`"
      ></div>
    </div>
  </div>
</template>
