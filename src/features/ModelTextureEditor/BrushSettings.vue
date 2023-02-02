<script lang="ts" setup>
import { Brush, getDefaultBrush } from "./pixi/brush";
import { reactive, watch } from "vue";
import { throttle } from "@google/model-viewer/lib/utilities";

interface Props {
  onChange: (newBrush: Brush, oldBrush: Brush) => void;
}

const props = defineProps<Props>();

const brush = reactive<Brush>({
  ...getDefaultBrush(),
});

watch(() => ({ ...brush }), throttle(props.onChange, 50));
</script>
<template>
  <div class="flex items-center">
    <strong class="mr-2">Brush</strong>
    <div class="flex space-x-4 mr-4">
      <input v-model="brush.color" type="color" />
    </div>

    <div class="items-center flex mr-4">
      <input
        v-model.number="brush.size"
        class="w-20"
        max="48"
        min="1"
        type="range"
      />
      <span class="text-sm ml-2">{{ brush.size }}px</span>
    </div>

    <div class="text-xs">
      <label
        ><input v-model="brush.shape" type="radio" value="circle" />
        Circle</label
      ><br />
      <label
        ><input v-model="brush.shape" type="radio" value="square" />
        Square</label
      >
    </div>

    <div
      class="flex items-center justify-center border border-gray-400 w-12 h-12 ml-4"
    >
      <div
        :class="brush.shape === 'circle' ? 'rounded-full' : ''"
        :style="`background-color: ${brush.color}; width: ${brush.size}px; height: ${brush.size}px`"
      ></div>
    </div>
  </div>
</template>
