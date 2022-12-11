import * as PIXI from "pixi.js";
import { ITextStyle, TextStyle } from "pixi.js";
import { Character } from "../pkg/chars";
import { OutlineFilter } from "pixi-filters";

export interface CharacterPreset {
  offset: { x: number; y: number };
  fontScale: number;
  textStyle: ITextStyle;
}

export function getDefaultCharacterPreset(): CharacterPreset {
  return {
    fontScale: 0.8,
    offset: { x: 0, y: 0 },
    textStyle: new TextStyle({
      fontFamily: "monospace",
    }),
  };
}

function nullOperation() {
  // do nothing
}

export class EditorCharacter extends PIXI.Text {
  char: Character;
  isSelected = false;
  onSelect: (char: EditorCharacter) => void = nullOperation;
  onDeselect: (char: EditorCharacter) => void = nullOperation;

  constructor(char: Character) {
    super(char.value);
    this.char = char;

    this.interactive = true;
    this.on("click", this.toggleSelect);
    this.on("mouseenter", this.select);
    this.on("mouseout", this.deselect);
  }

  toggleSelect(): void {
    this.isSelected ? this.deselect() : this.select();
  }

  select(): void {
    this.isSelected = true;
    this.filters = [new OutlineFilter(2)];
    this.onSelect(this);
  }

  deselect(): void {
    this.isSelected = false;
    this.filters = [];
    this.onDeselect(this);
  }
}
