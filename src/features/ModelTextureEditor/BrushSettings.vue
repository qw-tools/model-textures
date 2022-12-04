<script lang="ts" setup>
import { Brush } from "../../pkg/konva/Brush";
import { reactive, watch } from "vue";
import { throttle } from "@google/model-viewer/lib/utilities";

interface Props {
  brush: Brush;
  onChange: (newBrush: Brush, oldBrush: Brush) => void;
}

const props = defineProps<Props>();

const store = reactive<Brush>({
  ...props.brush,
});

watch(() => ({ ...store }), throttle(props.onChange, 50));
</script>
<template>
  <div class="flex items-center">
    <strong class="mr-2">Brush</strong>
    <div class="flex space-x-4 mr-4">
      <input v-model="store.color" type="color" />
    </div>

    <div class="items-center flex mr-4">
      <input
        v-model.number="store.size"
        class="w-20"
        max="48"
        min="1"
        type="range"
      />
      <span class="text-sm ml-2">{{ store.size }}px</span>
    </div>

    <div class="text-xs">
      <label
        ><input v-model="store.shape" type="radio" value="round" />
        Circle</label
      ><br />
      <label
        ><input v-model="store.shape" type="radio" value="square" />
        Square</label
      >
    </div>

    <div
      class="flex items-center justify-center border border-gray-400 w-12 h-12 ml-4"
    >
      <div
        :class="store.shape === 'round' ? 'rounded-full' : ''"
        :style="`background-color: ${store.color}; width: ${store.size}px; height: ${store.size}px`"
      ></div>
    </div>
  </div>
</template>
