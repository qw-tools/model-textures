<script lang="ts" setup>
import {
  BlurFilterSetting,
  BrightnessFilterSetting,
  ContrastFilterSetting,
  FilterSettings,
  GrayscaleFilterSetting,
  HUEFilterSetting,
  SaturationFilterSetting,
} from "../konva/Filter";
import { reactive, watch } from "vue";
import { throttle } from "@google/model-viewer/lib/utilities";

interface Props {
  onChange: (newFilters: FilterSettings, oldFilters: FilterSettings) => void;
}

const props = defineProps<Props>();

const store: FilterSettings = reactive({
  blur: new BlurFilterSetting(),
  grayscale: new GrayscaleFilterSetting(),
  hue: new HUEFilterSetting(),
  saturation: new SaturationFilterSetting(),
  brightness: new BrightnessFilterSetting(),
  contrast: new ContrastFilterSetting(),
});

watch(store, throttle(props.onChange, 20));
</script>
<template>
  <div class="flex items-center space-x-8">
    <div class="flex items-center space-x-2">
      <label>
        <input v-model="store.hue.enabled" type="checkbox" />
        <strong>HUE</strong>
      </label>
      <input
        v-model.number="store.hue.value"
        :disabled="!store.hue.enabled"
        :max="store.hue.max"
        :min="store.hue.min"
        class="w-24"
        type="range"
      />
    </div>

    <div class="flex items-center space-x-2">
      <label>
        <input v-model="store.saturation.enabled" type="checkbox" />
        <strong>Saturation</strong>
      </label>
      <input
        v-model.number="store.saturation.value"
        :disabled="!store.saturation.enabled"
        :max="store.saturation.max"
        :min="store.saturation.min"
        :step="store.saturation.max / 100"
        class="w-24"
        type="range"
      />
    </div>

    <div class="flex items-center space-x-2">
      <label>
        <input v-model="store.brightness.enabled" type="checkbox" />
        <strong>Brightness</strong>
      </label>
      <input
        v-model.number="store.brightness.value"
        :disabled="!store.brightness.enabled"
        :max="store.brightness.max"
        :min="store.brightness.min"
        :step="0.1"
        class="w-24"
        type="range"
      />
    </div>

    <div class="flex items-center space-x-2">
      <label>
        <input v-model="store.blur.enabled" type="checkbox" />
        <strong>Blur</strong>
      </label>
      <input
        v-model.number="store.blur.value"
        :disabled="!store.blur.enabled"
        :max="store.blur.max"
        :min="store.blur.min"
        :step="1"
        class="w-24"
        type="range"
      />
    </div>
  </div>
</template>
