<script lang="ts" setup>
import { reactive, watch } from "vue";
import { throttle } from "@google/model-viewer/lib/utilities";
import { FilterInputs, getDefaultFilterInputs } from "./pixi/filter";

interface Props {
  onChange: (newFilters: FilterInputs, oldFilters: FilterInputs) => void;
}

const props = defineProps<Props>();
const filters: FilterInputs = reactive(getDefaultFilterInputs());

watch(filters, throttle(props.onChange, 20));
</script>
<template>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-y-1 gap-x-4">
    <div class="flex items-center space-x-2">
      <label class="text-sm whitespace-nowrap">
        <input v-model="filters.hue.enabled" type="checkbox" />
        <strong>HUE</strong>
      </label>
      <input
        v-model.number="filters.hue.value"
        :disabled="!filters.hue.enabled"
        :max="filters.hue.maxValue"
        :min="filters.hue.minValue"
        :step="10"
        class="w-20"
        type="range"
      />

      <label v-if="filters.hue.enabled" class="text-xs whitespace-nowrap">
        <input v-model="filters.hue.colorize" type="checkbox" />
        Colorize
      </label>
    </div>

    <div class="flex items-center space-x-2">
      <label class="text-sm whitespace-nowrap">
        <input v-model="filters.saturation.enabled" type="checkbox" />
        <strong>Saturation</strong>
      </label>
      <input
        v-model.number="filters.saturation.value"
        :disabled="!filters.saturation.enabled"
        :max="filters.saturation.maxValue"
        :min="filters.saturation.minValue"
        :step="0.05"
        class="w-20"
        type="range"
      />
    </div>

    <div class="flex items-center space-x-2">
      <label class="text-sm whitespace-nowrap">
        <input v-model="filters.contrast.enabled" type="checkbox" />
        <strong>Contrast</strong>
      </label>
      <input
        v-model.number="filters.contrast.value"
        :disabled="!filters.contrast.enabled"
        :max="filters.contrast.maxValue"
        :min="filters.contrast.minValue"
        :step="0.1"
        class="w-20"
        type="range"
      />
    </div>

    <div class="flex items-center space-x-2">
      <label class="text-sm whitespace-nowrap">
        <input v-model="filters.brightness.enabled" type="checkbox" />
        <strong>Brightness</strong>
      </label>
      <input
        v-model.number="filters.brightness.value"
        :disabled="!filters.brightness.enabled"
        :max="filters.brightness.maxValue"
        :min="filters.brightness.minValue"
        :step="0.1"
        class="w-20"
        type="range"
      />
    </div>

    <div class="flex items-center space-x-2">
      <label class="text-sm whitespace-nowrap">
        <input v-model="filters.blur.enabled" type="checkbox" />
        <strong>Blur</strong>
      </label>
      <input
        v-model.number="filters.blur.value"
        :disabled="!filters.blur.enabled"
        :max="filters.blur.maxValue"
        :min="filters.blur.minValue"
        class="w-20"
        type="range"
      />
    </div>

    <div class="flex items-center space-x-2">
      <label class="text-sm whitespace-nowrap">
        <input v-model="filters.pixelate.enabled" type="checkbox" />
        <strong>Pixelate</strong>
      </label>
      <input
        v-model.number="filters.pixelate.value"
        :disabled="!filters.pixelate.enabled"
        :max="filters.pixelate.maxValue"
        :min="filters.pixelate.minValue"
        class="w-20"
        type="range"
      />
    </div>
  </div>
</template>
