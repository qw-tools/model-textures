<script lang="ts" setup>
import { reactive } from "vue";

interface PaletteProps {
  onChange: (color: string) => void;
}

const props = defineProps<PaletteProps>();

const colors = [
  "#000000",
  "#777777",
  "#ffffff",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
  "#ff7700",
];

const store = reactive({
  currentColor: "#ff0000",
});

const onChange = (color: string) => {
  store.currentColor = color;
  props.onChange(color);
};
</script>
<template>
  <div class="flex gap-1 items-center">
    <div
      v-for="color in colors"
      :key="color"
      class="w-6 h-6 border border-black hover:border-4 cursor-pointer transition shadow flex items-center justify-center"
      :style="{ backgroundColor: color }"
      @click="() => onChange(color)"
      :class="
        color === store.currentColor ? 'w-8 h-8 border-black border-4' : ''
      "
    ></div>
  </div>
</template>
