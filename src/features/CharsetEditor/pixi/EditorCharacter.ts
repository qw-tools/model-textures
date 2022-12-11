import * as PIXI from "pixi.js";
import { Character } from "../pkg/chars";
import { OutlineFilter } from "pixi-filters";

export class EditorCharacter extends PIXI.Text {
  char: Character;
  isSelected: boolean = false;
  onSelect: (char: EditorCharacter) => void;
  onDeselect: (char: EditorCharacter) => void;

  constructor(char: Character) {
    super(char.value);
    this.char = char;

    this.interactive = true;
    this.onSelect = (char: EditorCharacter) => {
    };
    this.onDeselect = (char: EditorCharacter) => {
    };

    this.on("click", this.toggleSelect);
    this.on("mouseenter", this.select);
    this.on("mouseout", this.deselect);
  }

  toggleSelect(): void {
    console.log("toggleSelect");
    this.isSelected ? this.deselect() : this.select();
  }

  select(): void {
    this.isSelected = true;
    this.filters = [new OutlineFilter()];
    this.onSelect(this);
  }

  deselect(): void {
    this.isSelected = false;
    this.filters = [];
    this.onDeselect(this);
  }
}
