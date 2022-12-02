<script lang="ts" setup>
import { reactive, watch } from "vue";
import { throttle } from "@google/model-viewer/lib/utilities";
import {
  Blur,
  Brightness,
  Contrast,
  CssFilterSettings,
  Grayscale,
  HUE,
  Invert,
  Opacity,
  Saturation,
} from "../../pkg/CssFilter";

interface Props {
  onChange: (
    newFilters: CssFilterSettings,
    oldFilters: CssFilterSettings
  ) => void;
}

const props = defineProps<Props>();

const store: CssFilterSettings = reactive({
  blur: new Blur(),
  grayscale: new Grayscale(),
  hue: new HUE(),
  saturation: new Saturation(),
  brightness: new Brightness(),
  contrast: new Contrast(),
  opacity: new Opacity(),
  invert: new Invert(),
});

watch(store, throttle(props.onChange, 20));
</script>
<template>
  <div class="grid md:grid-cols-2 xl:flex items-center space-x-6">
    <div class="flex items-center space-x-2">
      <label>
        <input v-model="store.hue.enabled" type="checkbox" />
        <strong>HUE</strong>
      </label>
      <input
        v-model.number="store.hue.value"
        :disabled="!store.hue.enabled"
        :max="store.hue.maxValue"
        :min="store.hue.minValue"
        :step="10"
        class="w-20"
        type="range"
      />

      <label v-if="store.hue.enabled" class="text-sm fadeIn"
        ><input v-model="store.hue.colorize" type="checkbox" /> Colorize</label
      >
    </div>

    <div class="flex items-center space-x-2">
      <label>
        <input v-model="store.saturation.enabled" type="checkbox" />
        <strong>Saturation</strong>
      </label>
      <input
        v-model.number="store.saturation.value"
        :disabled="!store.saturation.enabled"
        :max="store.saturation.maxValue"
        :min="store.saturation.minValue"
        :step="10"
        class="w-20"
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
        :max="store.brightness.maxValue"
        :min="store.brightness.minValue"
        :step="10"
        class="w-20"
        type="range"
      />
    </div>

    <div class="flex items-center space-x-2">
      <label>
        <input v-model="store.contrast.enabled" type="checkbox" />
        <strong>Contrast</strong>
      </label>
      <input
        v-model.number="store.contrast.value"
        :disabled="!store.contrast.enabled"
        :max="store.contrast.maxValue"
        :min="store.contrast.minValue"
        class="w-20"
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
        :max="store.blur.maxValue"
        :min="store.blur.minValue"
        class="w-20"
        type="range"
      />
    </div>
  </div>
</template>
