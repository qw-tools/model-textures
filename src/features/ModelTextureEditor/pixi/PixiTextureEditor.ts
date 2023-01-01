import * as PIXI from "pixi.js";
import { OutlineFilter } from "pixi-filters";
import { PaintLayer } from "./PaintLayer";
import { saveAs } from "file-saver";

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

export class PixiTextureEditor extends PIXI.Application {
  private readonly _settings: TextureEditorSettings;
  private _textureSprite: PIXI.Sprite | undefined;
  private _textureContainer: PIXI.Container = new PIXI.Container();
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

    (this.view as HTMLCanvasElement).addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    this._settings = settings;

    this.outline = new OutlineFilter(4, 0xff0000);
    this.outline.enabled = true;
    this._textureContainer.filters = [this.outline];

    this.stage.addChild(this._textureContainer);
    this.loadTexture(settings.texturePath);

    this.paintLayer = new PaintLayer(
      this.renderer,
      settings.width,
      settings.height
    );
    this.paintLayer.onChange = () => {
      this.render();
      this.onChange();
    };
    this.stage.addChild(this.paintLayer.container);

    this.onChange = () => {
      this.render();
      settings.onChange();
    };

    this.onReady = () => {
      settings.onReady();
    };
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

      this.onChange();
      this.onReady();
    });
  }

  toggleOutline(): void {
    this.outline.enabled = !this.outline.enabled;
    this.onChange();
  }

  download(filename = ""): void {
    this.onChange();
    saveAs(this.toDataUrl(), filename || "download");
  }

  toDataUrl(): string {
    return (this.view as HTMLCanvasElement).toDataURL();
  }
}
