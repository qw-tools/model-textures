<script lang="ts" setup>
import { onMounted } from "vue";
import * as PIXI from "pixi.js";
import {
  Character,
  CHARACTER_COUNT,
  characters,
  CHARACTERS_PER_COLUMN,
  CHARACTERS_PER_ROW,
} from "./chars";
import { BevelFilter, DropShadowFilter, OutlineFilter } from "pixi-filters";
import { getAvailableFonts } from "./fonts";

let availableFonts: string[] = [];
let app: PIXI.Application;
let charContainer: PIXI.Container;
let grid: PIXI.Graphics;
const charFilters = {
  outline: new OutlineFilter(),
  dropShadow: new DropShadowFilter({
    distance: 2,
    blur: 0,
  }),
  bevel: new BevelFilter(),
};
Object.values(charFilters).forEach((f) => {
  f.enabled = false;
});

interface CharsetPreset {
  size: number;
  offset: { x: number; y: number };
  fontScale: number;
  colors: ColorSettings;
  textStyle: PIXI.ITextStyle;
}

interface ColorSettings {
  white: string;
  brown: string;
  green: string;
  gold: string;
}

const preset: CharsetPreset = {
  size: 1024,
  fontScale: 0.8,
  offset: { x: 0, y: 0 },
  colors: {
    white: "#7b7b7b",
    brown: "#8f4333",
    green: "#73571f",
    gold: "#8f6f23",
  },
  textStyle: new PIXI.TextStyle({
    fontFamily: "monospace",
    trim: false,
  }),
};

onMounted(async () => {
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

  app = new PIXI.Application({
    width: preset.size,
    height: preset.size,
    backgroundAlpha: 0,
  });

  pixiElement.appendChild(app.view as HTMLCanvasElement);

  initCharset();
  app.stage.addChild(charContainer);

  grid = new PIXI.Graphics();
  app.stage.addChild(grid);

  renderCharset();
});

function initCharset(): void {
  charContainer = new PIXI.Container();
  characters.forEach((char) => {
    // const isWhiteSpace = ["", " "].includes(char.value);
    //
    // if (isWhiteSpace) {
    //   return;
    // }

    const charText = new PIXI.Text(char.value);
    charContainer.addChild(charText);
  });
}

function updateGrid(cellSize: number): void {
  grid.clear();
  grid.lineStyle(1, 0xff00ff);

  for (let colIndex = 1; colIndex < CHARACTERS_PER_COLUMN; colIndex++) {
    const x = colIndex * cellSize;
    grid.moveTo(x, 0);
    grid.lineTo(x, preset.size);
  }

  for (let rowIndex = 1; rowIndex < CHARACTERS_PER_ROW; rowIndex++) {
    const y = rowIndex * cellSize;
    grid.moveTo(0, y);
    grid.lineTo(preset.size, y);
  }
}

function renderCharset(): void {
  const cellSize = preset.size / CHARACTERS_PER_ROW;
  const fontSize = preset.fontScale * cellSize;

  for (let index = 0; index < CHARACTER_COUNT; index++) {
    const char: Character = characters[index];
    const charText: PIXI.Text = charContainer.getChildAt(index) as PIXI.Text;
    charText.style = {
      ...preset.textStyle,
      fontSize,
      fill: preset.colors[char.theme],
    };

    const cellPos = {
      x: char.index.column * cellSize,
      y: char.index.row * cellSize,
    };
    charText.x = cellPos.x + charText.width / 2;
    charText.y = cellPos.y;
  }

  charContainer.x = preset.offset.x;
  charContainer.y = preset.offset.y;
  charContainer.filters = Object.values(charFilters);

  updateGrid(cellSize);
  app.view.width = preset.size;
  app.view.height = preset.size;
  app.render();
}

function getEventValue(e: Event): any {
  const el = e.target as HTMLInputElement;
  return el.value;
}

function getEventChecked(e: Event): any {
  const el = e.target as HTMLInputElement;
  return el.checked;
}

function onCharsetSizeChange(e: Event): void {
  preset.size = parseInt(getEventValue(e));
  renderCharset();
}

function onFontFamilyChange(e: Event): void {
  const value = getEventValue(e);
  preset.textStyle.fontFamily = value;
  document.getElementById("customFontSelect")?.setAttribute("value", value);
  renderCharset();
}
</script>
<template>
  <div class="flex space-x-8">
    <div>
      <div class="app-checker border border-gray-300 shadow">
        <div id="pixi"></div>
      </div>
    </div>

    <div class="space-y-4">
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
                      preset.textStyle.fontWeight = getEventChecked(e)
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
                :value="preset.fontScale"
                min="0"
                max="2"
                step="0.1"
                @change="
                  (e) => {
                    preset.fontScale = getEventValue(e);
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
                  :value="preset.offset.x"
                  @change="
                    (e) => {
                      preset.offset.x = getEventValue(e);
                      renderCharset();
                    }
                  "
                />
              </div>

              <div class="flex items-center text-sm">
                <input
                  type="number"
                  class="w-10"
                  :value="preset.offset.y"
                  @change="
                    (e) => {
                      preset.offset.y = getEventValue(e);
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
            v-for="[key, filter] in Object.entries(charFilters)"
            :key="key"
            class="flex items-center"
          >
            <input
              type="checkbox"
              @change="
                (e) => {
                  filter.enabled = getEventValue(e);
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
                  grid.visible = getEventChecked(e);
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
