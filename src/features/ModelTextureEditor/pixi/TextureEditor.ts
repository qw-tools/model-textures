import * as PIXI from "pixi.js";
import { OutlineFilter } from "pixi-filters";
import { PaintLayer } from "./PaintLayer";
import { saveAs } from "file-saver";
import { Brush } from "./types";

export interface TextureEditorSettings {
  width: number;
  height: number;
  texturePath: string;
  onReady: () => void;
  onChange: () => void;
}

const nullOperation = () => {
  // do nothing
};

export class TextureEditor extends PIXI.Application {
  private readonly _settings: TextureEditorSettings;
  private _textureSprite: PIXI.Sprite | undefined;
  private _textureContainer: PIXI.Container = new PIXI.Container();
  //private _cursor: Cursor = new Cursor();
  outline: OutlineFilter;
  paintLayer: PaintLayer;
  onReady: () => void = nullOperation;
  onChange: () => void = nullOperation;

  constructor(settings: TextureEditorSettings) {
    super({
      width: settings.width,
      height: settings.height,
      backgroundAlpha: 0,
    });

    this._settings = settings;

    // texture
    this.outline = new OutlineFilter(4, 0xff0000);
    this.outline.enabled = true;
    this._textureContainer.filters = [this.outline];

    this.stage.addChild(this._textureContainer);

    // paint
    this.paintLayer = new PaintLayer(
      this.renderer,
      settings.width,
      settings.height
    );
    this.paintLayer.onChange = () => {
      this._onChange();
    };

    this.stage.addChild(this.paintLayer.container);

    // events
    this.getCanvas().addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    this.onChange = settings.onChange;

    // load texture
    this.loadTexture(settings.texturePath);
  }

  _onChange(): void {
    this.render();
    this.onChange();
  }

  set brush(brush: Brush) {
    this.paintLayer.brush = brush;

    //this.getCanvas().style.cursor = this._cursor.toCss(this.renderer, brush);
  }

  loadTexture(url: string): void {
    PIXI.Assets.load(url).then((texture: PIXI.Texture) => {
      this._textureContainer.removeChildren();
      const sprite = PIXI.Sprite.from(texture);
      sprite.scale.x = this._settings.width / texture.orig.width;
      sprite.scale.y = this._settings.height / texture.orig.height;
      sprite.roundPixels = false;
      this._textureSprite = sprite;
      this._textureContainer.addChild(this._textureSprite);

      this._onChange();
      this.onReady();
    });
  }

  toggleOutline(): void {
    this.outline.enabled = !this.outline.enabled;
    this._onChange();
  }

  download(filename = ""): void {
    saveAs(this.toDataUrl(), filename || "download");
  }

  toDataUrl(): string {
    return this.getCanvas().toDataURL();
  }

  getCanvas(): HTMLCanvasElement {
    return this.view as HTMLCanvasElement;
  }
}
