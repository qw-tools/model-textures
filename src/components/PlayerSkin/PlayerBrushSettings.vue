<script lang="ts" setup>
import { BrushSettings } from "./Brush";

interface Props {
  modelValue: BrushSettings;
}

const props = defineProps<Props>();
</script>
<template>
  <div class="flex items-center">
    <strong class="mr-2">Brush</strong>
    <div class="flex space-x-4 mr-4">
      <input type="color" v-model="props.modelValue.color" />
    </div>

    <div class="items-center flex mr-4">
      <input
        type="range"
        min="1"
        max="32"
        class="w-20"
        v-model.number="props.modelValue.size"
      />
      <span class="text-sm ml-2">{{ props.modelValue.size }}px</span>
    </div>

    <div class="text-xs">
      <label
        ><input type="radio" value="round" v-model="props.modelValue.shape" />
        Circle</label
      ><br />
      <label
        ><input type="radio" value="square" v-model="props.modelValue.shape" />
        Square</label
      >
    </div>

    <div
      class="flex items-center justify-center border border-gray-400 w-10 h-10 ml-4"
    >
      <div
        :class="props.modelValue.shape === 'round' ? 'rounded-full' : ''"
        :style="`background-color: ${props.modelValue.color}; width: ${props.modelValue.size}px; height: ${props.modelValue.size}px`"
      ></div>
    </div>
  </div>
</template>
