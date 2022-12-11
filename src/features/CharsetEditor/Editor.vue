<script lang="ts" setup>
import { onMounted } from "vue";
import * as PIXI from "pixi.js";
import { characters, CHARACTERS_PER_ROW, Theme } from "./chars";

let app: PIXI.Application;

const charsetSize = 512;

const textStyle: PIXI.TextStyle = new PIXI.TextStyle({
  fontSize: (charsetSize / CHARACTERS_PER_ROW) * 0.8,
  fontFamily: "monospace",
});

const cellSize = (charsetSize / CHARACTERS_PER_ROW);

function colorByTheme(theme: Theme): string {
  switch (theme) {
    case Theme.BROWN:
      return "#8f4333";
    case Theme.GREEN:
      return "#73571f";
    case Theme.GOLD:
      return "#8f6f23";
    default:
      return "#7b7b7b";
  }
}

onMounted(() => {
  const pixiElement = document.getElementById("pixi");
  if (!pixiElement) {
    return;
  }

  app = new PIXI.Application({
    width: charsetSize,
    height: charsetSize,
    backgroundColor: "#000000",
  });
  pixiElement.appendChild(app.view as HTMLCanvasElement);

  characters.forEach((char) => {
    const isWhiteSpace = ["", " "].includes(char.value);

    if (isWhiteSpace) {
      return;
    }

    const charText = new PIXI.Text(char.value, {
      ...textStyle,
      fill: colorByTheme(char.theme),
    });
    charText.x = char.index.column * cellSize;
    charText.y = char.index.row * cellSize;
    app.stage.addChild(charText);
  });

  app.render();
});
</script>
<template>
  <div id="pixi" :style="`width: ${charsetSize}px; height: ${charsetSize}px`"></div>
</template>