import * as PIXI from "pixi.js";
import { Character } from "../pkg/chars";
import { EditorCharacter } from "./EditorCharacter";

export class CharacterContainer extends PIXI.Container {
  constructor(characters: Character[]) {
    super();

    this.interactive = true;
    this.interactiveChildren = true;

    for (let index = 0; index < characters.length; index++) {
      const charText = new EditorCharacter(characters[index]);
      this.addChild(charText);
    }
  }
}
