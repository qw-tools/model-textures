<script lang="ts" setup>
interface PaletteProps {
  onColorChange: (color: string) => void;
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
];
</script>
<template>
  <div class="flex gap-1">
    <div
      v-for="color in colors"
      class="w-8 h-8 border border-black hover:border-4 cursor-pointer transition shadow"
      :style="{ backgroundColor: color }"
      @click="() => props.onColorChange(color)"
    ></div>
  </div>
</template>
