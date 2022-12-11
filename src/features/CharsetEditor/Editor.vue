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

let app: PIXI.Application;
let charContainer: PIXI.Container;
let grid: PIXI.Graphics;
let charFilters = {
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
  fontScale: number;
  colors: ColorSettings;
  textStyle: PIXI.ITextStyle;
}

interface ColorSettings {
  white: string;
  brown: string;
  green: string;
  //gold: string;
}

let preset: CharsetPreset = {
  size: 1024,
  fontScale: 0.8,
  colors: {
    white: "#7b7b7b",
    brown: "#8f4333",
    green: "#73571f",
    //gold: "#8f6f23",
  },
  textStyle: {
    fontFamily: "monospace",
    trim: false,
  },
};

onMounted(() => {
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

    charText.x = char.index.column * cellSize + charText.width / 2;
    charText.y = char.index.row * cellSize;
  }

  charContainer.filters = Object.values(charFilters);

  updateGrid(cellSize);
  app.view.width = preset.size;
  app.view.height = preset.size;
  app.render();
}

function onCharsetSizeChange(e: Event): void {
  if (!e.target) {
    return;
  }
  preset.size = parseInt(e.target.value);
  renderCharset();
}
</script>
<template>
  <div class="flex space-x-8">
    <div class="app-checker border border-gray-300 shadow">
      <div id="pixi"></div>
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

      <div class="space-y-4">
        <strong>Font</strong>

        <div>
          <label class="flex items-center">
            <div class="w-20">Weight</div>

            <input
              type="checkbox"
              @change="
                (e) => {
                  preset.textStyle.fontWeight = e.target.checked ? 'bold' : '';
                  renderCharset();
                }
              "
            />
            Bold
          </label>

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
                  preset.fontScale = e.target.value;
                  renderCharset();
                }
              "
            />
          </div>
        </div>
      </div>

      <hr />

      <div>
        <strong>Text colors</strong>

        <div
          v-for="(value, key) in preset.colors"
          class="space-x-4 flex items-center"
        >
          <span class="w-14 capitalize">{{ key }}</span>

          <input
            type="color"
            :value="value"
            @change="
              (e) => {
                preset.colors[key] = e.target.value;
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
            class="flex items-center"
          >
            <input
              type="checkbox"
              @change="
                (e) => {
                  filter.enabled = e.target.checked;
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
                  grid.visible = e.target.checked;
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