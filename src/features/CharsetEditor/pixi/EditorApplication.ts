import { Application, IApplicationOptions } from "pixi.js";
import { CharacterContainer } from "./CharacterContainer";
import { characters } from "../pkg/chars";
import { GridLines } from "./GridLines";

export class EditorApplication extends Application {
  charContainer = new CharacterContainer(characters);
  grid: GridLines = new GridLines();

  constructor(options: IApplicationOptions) {
    super(options);

    this.stage.addChild(this.charContainer);
    this.stage.addChild(this.grid);
  }
}
