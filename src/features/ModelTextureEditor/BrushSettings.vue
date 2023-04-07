<script lang="ts" setup>
import { reactive, watch } from "vue";
import { Brush, getDefaultBrush } from "./pixi/brush";
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

    <div>
      <div class="flex items-center space-x-2 text-xs">
        <label
          ><input v-model="brush.shape" type="radio" value="circle" />
          Circle</label
        ><br />
        <label
          ><input v-model="brush.shape" type="radio" value="square" />
          Square</label
        >
      </div>

      <div class="items-center flex mt-1">
        <input
          v-model.number="brush.size"
          class="w-20"
          max="48"
          min="1"
          type="range"
        />
        <span class="text-xs ml-2">{{ brush.size }}px</span>
      </div>
    </div>
  </div>
</template>
