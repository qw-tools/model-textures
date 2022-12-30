<script lang="ts" setup>
import { onMounted } from "vue";
import { getAvailableFonts } from "./pkg/fonts";
import LoadingIndicator from "./LoadingIndicator.vue";
import {
  EditorApplication,
  getDefaultEditorPreset,
} from "./pixi/EditorApplication";

let availableFonts: string[] = [];
let app: EditorApplication;
const preset = getDefaultEditorPreset();

onMounted(async () => {
  document.getElementById("loading")?.remove();

  // set fonts
  await document.fonts.ready;
  availableFonts = getAvailableFonts();
  const fontSelect = document.getElementById("fontSelect");

  if (fontSelect) {
    availableFonts.forEach((name) => {
      const option = document.createElement("option") as HTMLOptionElement;
      option.text = name;
      fontSelect.appendChild(option);
    });
  }

  const pixiElement = document.getElementById("pixi");
  if (!pixiElement) {
    return;
  }

  app = new EditorApplication(preset);
  pixiElement.appendChild(app.view as HTMLCanvasElement);
});

function renderCharset(): void {
  app.applyPreset(preset);
}

function getEventValue(e: Event): string {
  const el = e.target as HTMLInputElement;
  return el.value;
}

function getEventChecked(e: Event): boolean {
  const el = e.target as HTMLInputElement;
  return el.checked;
}

function onCharsetSizeChange(e: Event): void {
  preset.size = parseInt(getEventValue(e));
  renderCharset();
}

function onFontFamilyChange(e: Event): void {
  const value = getEventValue(e);
  preset.characters.textStyle.fontFamily = value;
  document.getElementById("customFontSelect")?.setAttribute("value", value);
  renderCharset();
}

function resetSettings() {
  window.location.reload();
}
</script>
<template>
  <div class="flex space-x-8">
    <div>
      <LoadingIndicator
        id="loading"
        :style="`width: ${preset.size}px; height: ${preset.size / 2}px`"
      />
      <div class="app-checker border border-gray-300 shadow cursor-pointer">
        <div id="pixi"></div>
      </div>
    </div>

    <div class="space-y-4">
      <div class="flex justify-between">
        <div class="text-lg font-bold">Settings</div>
        <button
          class="rounded border border-gray-400 shadow bg-gray-300 hover:bg-gray-200 px-2 text-sm"
          @click="resetSettings"
        >
          reset
        </button>
      </div>

      <hr />

      <div class="space-x-4">
        <strong>Size</strong>

        <label>
          <input
            type="radio"
            name="charsetSize"
            value="1024"
            checked
            @change="onCharsetSizeChange"
          />
          1024 px
        </label>

        <label>
          <input
            type="radio"
            name="charsetSize"
            value="512"
            @change="onCharsetSizeChange"
          />
          512 px
        </label>
      </div>

      <hr />

      <div>
        <strong>Font</strong>

        <div class="space-y-2">
          <div class="flex items-center">
            <div class="w-20">Family</div>

            <div class="text-sm">
              <select id="fontSelect" @change="onFontFamilyChange">
                <option></option>
              </select>

              <input
                type="text"
                class="w-40"
                id="customFontSelect"
                @change="onFontFamilyChange"
              />
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex items-center">
              <div class="w-20">Weight</div>

              <label class="flex items-center">
                <input
                  type="checkbox"
                  @change="
                    (e) => {
                      preset.characters.textStyle.fontWeight = getEventChecked(
                        e
                      )
                        ? 'bold'
                        : 'normal';
                      renderCharset();
                    }
                  "
                />
                Bold</label
              >
            </div>

            <div class="flex items-center">
              <div class="w-20">Scale</div>

              <input
                type="range"
                :value="preset.characters.fontScale"
                min="0"
                max="2"
                step="0.1"
                @change="
                  (e) => {
                    preset.characters.fontScale = parseFloat(getEventValue(e));
                    renderCharset();
                  }
                "
              />
            </div>

            <div class="flex items-center">
              <div class="w-20">Offset</div>

              <div class="flex items-center text-sm">
                <input
                  type="number"
                  class="w-10"
                  :value="preset.characters.offset.x"
                  @change="
                    (e) => {
                      preset.characters.offset.x = parseFloat(getEventValue(e));
                      renderCharset();
                    }
                  "
                />
              </div>

              <div class="flex items-center text-sm">
                <input
                  type="number"
                  class="w-10"
                  :value="preset.characters.offset.y"
                  @change="
                    (e) => {
                      preset.characters.offset.y = parseFloat(getEventValue(e));
                      renderCharset();
                    }
                  "
                />
                <span class="text-xs text-gray-400">(x, y) </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div>
        <strong>Text colors</strong>

        <div
          v-for="(value, key) in preset.colors"
          :key="key"
          class="space-x-4 flex items-center"
        >
          <span class="w-14 capitalize">{{ key }}</span>

          <input
            type="color"
            :value="value"
            @change="
              (e) => {
                preset.colors[key] = getEventValue(e);
                renderCharset();
              }
            "
          />
        </div>
      </div>

      <hr />

      <div>
        <strong>Effects</strong>

        <div>
          <label
            v-for="[key, filter] in Object.entries(preset.filters)"
            :key="key"
            class="flex items-center"
          >
            <input
              type="checkbox"
              @change="
                (e) => {
                  filter.enabled = getEventChecked(e);
                  app.render();
                }
              "
            />
            <span class="capitalize">{{ key }}</span>
          </label>
        </div>
      </div>

      <hr />

      <div>
        <strong>Editor settings</strong>

        <div class="space-y-4">
          <label class="flex items-center">
            <input
              type="checkbox"
              checked
              @change="
                (e) => {
                  app.grid.visible = getEventChecked(e);
                  app.render();
                }
              "
            />
            Show grid
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
