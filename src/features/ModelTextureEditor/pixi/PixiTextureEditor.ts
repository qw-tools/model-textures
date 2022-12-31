import * as PIXI from "pixi.js";
import { OutlineFilter } from "pixi-filters";
import { PaintLayer } from "./PaintLayer";

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
  _outlineFilter: OutlineFilter;
  _textureSprite: PIXI.Sprite | undefined;
  _textureContainer: PIXI.Container = new PIXI.Container();
  _paintLayer: PaintLayer;
  onReady: () => void = nullOperation;
  onChange: () => void = nullOperation;

  constructor(settings: TextureEditorSettings) {
    super({
      width: settings.width,
      height: settings.height,
      backgroundAlpha: 0,
    });

    // this.stage.interactive = true;
    // this.stage.addEventListener("contextmenu", (e) => {
    //   e.preventDefault();
    // });

    this._settings = settings;

    this._outlineFilter = new OutlineFilter(4, 0xff0000);
    this._outlineFilter.enabled = true;
    this._textureContainer.filters = [this._outlineFilter];

    this.stage.addChild(this._textureContainer);
    this.loadTexture(settings.texturePath);

    this._paintLayer = new PaintLayer(settings.width, settings.height);
    this._paintLayer.onPaint = () => this.render();
    this.stage.addChild(this._paintLayer);
  }

  loadTexture(url: string): void {
    PIXI.Assets.load(url).then((texture: PIXI.Texture) => {
      this._textureContainer.removeChildren();
      const sprite = PIXI.Sprite.from(texture);
      sprite.anchor.set(0.5);
      sprite.x = this._settings.width / 2;
      sprite.y = this._settings.height / 2;
      sprite.scale.x = this._settings.width / texture.orig.width;
      sprite.scale.y = this._settings.height / texture.orig.height;
      sprite.roundPixels = false;
      this._textureSprite = sprite;
      this._textureContainer.addChild(this._textureSprite);

      this.render();
      this.onReady();
    });
  }

  toggleOutline(): void {
    this._outlineFilter.enabled = !this._outlineFilter.enabled;
    this.render();
  }

  clearPaint(): void {
    this._paintLayer.clear();
    this.render();
  }
}
