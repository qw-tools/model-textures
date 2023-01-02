import * as PIXI from "pixi.js";
import { PaintLayer } from "./PaintLayer";
import { saveAs } from "file-saver";
import { Brush, getDefaultBrush } from "./brush";
import { slugify } from "../../../pkg/stringUtil";
import { Items, modelFilenamePath, player } from "../../../pkg/quake/items";
import { nullOperation } from "../../../pkg/functions";
import { BrushChange, EditorEvent, FiltersChange } from "./events";
import { createOutline } from "../../../pkg/pixi";
import { FilterInputs } from "./filter";
import { AdjustmentFilter } from "pixi-filters";

export interface TextureEditorSettings {
  containerID: string;
  width: number;
  height: number;
  texturePath: string;
  onReady: () => void;
  onChange: () => void;
}

export class TextureEditor extends PIXI.Application {
  private readonly _outline: HTMLImageElement;
  private readonly _settings: TextureEditorSettings;
  private readonly _adjustmentFilter: AdjustmentFilter;
  private _textureSprite: PIXI.Sprite | undefined;
  private _textureContainer: PIXI.Container = new PIXI.Container();
  readonly paint: PaintLayer;
  onReady: () => void = nullOperation;
  onChange: () => void = nullOperation;

  constructor(settings: TextureEditorSettings) {
    const { width, height, containerID } = settings;
    super({ width, height, backgroundAlpha: 0 });
    this._settings = settings;

    // texture
    this._adjustmentFilter = new AdjustmentFilter();
    this._textureContainer.filters = [this._adjustmentFilter];
    this.stage.addChild(this._textureContainer);

    // paint
    this.paint = new PaintLayer(this.renderer, width, height);
    this.paint.onChange = () => this._onChange();
    this.stage.addChild(this.paint.container);

    // outline
    this._outline = document.createElement("img");
    this._outline.style.display = "none";
    this._outline.style.pointerEvents = "none";
    this._outline.style.position = "absolute";
    document.getElementById(containerID)?.append(this._outline);

    // events
    this._listen();

    // callbacks
    this.onChange = settings.onChange;
    this.onReady = settings.onReady;

    // brush
    this.brush = getDefaultBrush();

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

    this._onFiltersChange = this._onFiltersChange.bind(this);
    document.addEventListener(
      EditorEvent.FILTERS_CHANGE,
      this._onFiltersChange
    );
  }

  private _unlisten(): void {
    this.getCanvas().removeEventListener("contextmenu", this._preventDefault);
    document.removeEventListener(EditorEvent.BRUSH_CHANGE, this._onBrushChange);
    document.removeEventListener(
      EditorEvent.FILTERS_CHANGE,
      this._onFiltersChange
    );
  }

  private _onChange(): void {
    this.render();
    this.onChange();
  }

  private _onBrushChange(e: Event): void {
    this.brush = (e as BrushChange).brush;
  }

  private _onFiltersChange(e: Event): void {
    this.filters = (e as FiltersChange).filters;
  }

  private _preventDefault(e: Event): void {
    e.preventDefault();
  }

  set brush(brush: Brush) {
    this.paint.brush = brush;
  }

  set filters(filters: FilterInputs) {
    Object.values(filters).forEach((f) => {
      this._adjustmentFilter[f.name] = f.enabled ? f.value : f.defaultValue;
    });
    this._onChange();
  }

  loadTexture(url: string): void {
    PIXI.Assets.load(url).then(async (texture: PIXI.Texture) => {
      const { width, height } = this._settings;

      // texture
      this._textureSprite?.destroy();
      this._textureSprite = PIXI.Sprite.from(texture);
      this._textureSprite.scale.x = width / texture.orig.width;
      this._textureSprite.scale.y = height / texture.orig.height;
      this._textureContainer.addChild(this._textureSprite);

      // outline
      const o = await createOutline(this.renderer, texture, width, height);
      this._outline.src = this.renderer.plugins.extract.canvas(o).toDataURL();

      // callbacks
      this._onChange();
      this.onReady();
    });
  }

  toggleOutline(): void {
    const d = this._outline.style.display;
    this._outline.style.display = d === "none" ? "block" : "none";
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
