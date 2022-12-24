import * as PIXI from "pixi.js";
import { Application } from "pixi.js";
import { CharacterContainer } from "./CharacterContainer";
import { CHARACTER_COUNT, characters, CHARACTERS_PER_ROW } from "../pkg/chars";
import { GridLines } from "./GridLines";
import {
  CharacterPreset,
  EditorCharacter,
  getDefaultCharacterPreset,
} from "./EditorCharacter";
import { BevelFilter, DropShadowFilter, OutlineFilter } from "pixi-filters";

export interface EditorPreset {
  size: number;
  colors: ColorSettings;
  characters: CharacterPreset;
  filters: FilterPreset;
}

export interface FilterPreset {
  outline: OutlineFilter;
  dropShadow: DropShadowFilter;
  bevel: BevelFilter;
}

export interface ColorSettings {
  white: string;
  brown: string;
  green: string;
  gold: string;
}

export function getDefaultEditorPreset(): EditorPreset {
  const filters = {
    outline: new OutlineFilter(),
    dropShadow: new DropShadowFilter({
      distance: 2,
      blur: 0,
    }),
    bevel: new BevelFilter(),
  };
  Object.values(filters).forEach((f) => {
    f.enabled = false;
  });

  return {
    size: 1024,
    colors: {
      white: "#7b7b7b",
      brown: "#8f4333",
      green: "#73571f",
      gold: "#8f6f23",
    },
    characters: getDefaultCharacterPreset(),
    filters,
  };
}

export class EditorApplication extends Application {
  charContainer = new CharacterContainer(characters);
  grid: GridLines = new GridLines();

  constructor(preset: EditorPreset) {
    super({
      width: preset.size,
      height: preset.size,
      backgroundAlpha: 0,
    });
    this.stage.addChild(this.charContainer);
    this.stage.addChild(this.grid);
    this.applyPreset(preset);
  }

  applyPreset(preset: EditorPreset) {
    const cellSize = preset.size / CHARACTERS_PER_ROW;
    const fontSize = preset.characters.fontScale * cellSize;

    for (let index = 0; index < CHARACTER_COUNT; index++) {
      const charText = this.charContainer.getChildAt(index) as EditorCharacter;
      charText.style = {
        ...preset.characters.textStyle,
        fontSize,
        fill: preset.colors[charText.char.theme],
      };
      charText.onSelect = () => {
        this.render();
      };

      const cellPos = {
        x: charText.char.index.column * cellSize,
        y: charText.char.index.row * cellSize,
      };
      const centerOffset = {
        x: cellSize / 2 - charText.width / 2,
        y: cellSize / 2 - charText.height / 2,
      };
      charText.x = cellPos.x + centerOffset.x;
      charText.y = cellPos.y + centerOffset.y;

      charText.hitArea = new PIXI.Rectangle(
        -centerOffset.x,
        -centerOffset.y,
        cellSize,
        cellSize
      );
    }

    this.charContainer.x = preset.characters.offset.x;
    this.charContainer.y = preset.characters.offset.y;
    this.charContainer.filters = Object.values(preset.filters);

    this.grid.draw(cellSize, preset.size);
    this.view.width = preset.size;
    this.view.height = preset.size;
    this.render();
  }
}
