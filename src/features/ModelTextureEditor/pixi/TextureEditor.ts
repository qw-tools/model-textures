import * as PIXI from "pixi.js";
import { PaintLayer } from "./PaintLayer";
import { saveAs } from "file-saver";
import { Brush } from "./brush";
import { slugify } from "../../../pkg/stringUtil";
import { Items, modelFilenamePath, player } from "../../../pkg/quake/items";
import { nullOperation } from "../../../pkg/functions";
import { BrushChange, EditorEvent } from "./events";
import { createOutline } from "../../../pkg/pixi";

export interface TextureEditorSettings {
  containerID: string;
  width: number;
  height: number;
  texturePath: string;
  onReady: () => void;
  onChange: () => void;
}

export class TextureEditor extends PIXI.Application {
  private readonly _settings: TextureEditorSettings;
  private _textureSprite: PIXI.Sprite | undefined;
  private _textureContainer: PIXI.Container = new PIXI.Container();
  private readonly _outlineImg: HTMLImageElement;
  //private _cursor: Cursor = new Cursor();
  readonly paintLayer: PaintLayer;
  onReady: () => void = nullOperation;
  onChange: () => void = nullOperation;

  constructor(settings: TextureEditorSettings) {
    const { width, height, containerID } = settings;
    super({ width, height, backgroundAlpha: 0 });
    this._settings = settings;

    // texture
    this.stage.addChild(this._textureContainer);

    // paint
    this.paintLayer = new PaintLayer(this.renderer, width, height);
    this.paintLayer.onChange = () => this._onChange();
    this.stage.addChild(this.paintLayer.container);

    // outline
    this._outlineImg = document.createElement("img");
    this._outlineImg.style.display = "none";
    this._outlineImg.style.pointerEvents = "none";
    this._outlineImg.style.position = "absolute";
    document.getElementById(containerID)?.append(this._outlineImg);

    // events
    this._listen();

    // callbacks
    this.onChange = settings.onChange;
    this.onReady = settings.onReady;

    // load texture
    this.loadTexture(settings.texturePath);
  }

  destroy(): void {
    this._unlisten();

    super.destroy(true, {
      baseTexture: true,
      children: true,
      texture: true,
    });
  }

  private _listen(): void {
    this.getCanvas().addEventListener("contextmenu", this._preventDefault);

    this._onBrushChange = this._onBrushChange.bind(this);
    document.addEventListener(EditorEvent.BRUSH_CHANGE, this._onBrushChange);
  }

  private _unlisten(): void {
    this.getCanvas().removeEventListener("contextmenu", this._preventDefault);
    document.removeEventListener(EditorEvent.BRUSH_CHANGE, this._onBrushChange);
  }

  private _onChange(): void {
    this.render();
    this.onChange();
  }

  private _onBrushChange(e: Event): void {
    this.paintLayer.brush = (e as BrushChange).brush;
  }

  private _preventDefault(e: Event): void {
    e.preventDefault();
  }

  set brush(brush: Brush) {
    this.paintLayer.brush = brush;
    //this.getCanvas().style.cursor = this._cursor.toCss(this.renderer, brush);
  }

  loadTexture(url: string): void {
    PIXI.Assets.load(url).then(async (texture: PIXI.Texture) => {
      this._textureContainer.removeChildren();

      const { width, height } = this._settings;

      const sprite = PIXI.Sprite.from(texture);
      sprite.scale.x = width / texture.orig.width;
      sprite.scale.y = height / texture.orig.height;
      this._textureSprite = sprite;
      this._textureContainer.addChild(this._textureSprite);

      const outline = await createOutline(
        this.renderer,
        texture,
        width,
        height
      );
      this._outlineImg.src = this.renderer.plugins.extract
        .canvas(outline)
        .toDataURL();

      this._onChange();
      this.onReady();
    });
  }

  toggleOutline(): void {
    const d = this._outlineImg.style.display;
    this._outlineImg.style.display = d === "none" ? "block" : "none";
  }

  download(filename = ""): void {
    this.render();
    saveAs(this.toDataUrl(), filename || "download");
  }

  toDataUrl(): string {
    return this.getCanvas().toDataURL();
  }

  getCanvas(): HTMLCanvasElement {
    return this.view as HTMLCanvasElement;
  }
}

// methods
export function itemToEditorSettings(item: Items): TextureEditorSettings[] {
  return item.model.textures.map(function (texture) {
    const editorScale = getEditorHeightByItem(item) / texture.height;
    const containerID = slugify(
      `editor ${item.model.filename} ${texture.filename}`
    );
    return {
      containerID,
      texturePath: modelFilenamePath(texture.filename),
      width: editorScale * texture.width,
      height: editorScale * texture.height,
      onChange: nullOperation,
      onReady: nullOperation,
    };
  });
}

function getEditorHeightByItem(item: Items): number {
  if (item.model.name === player.model.name) {
    return 520;
  }
  return 240;
}
