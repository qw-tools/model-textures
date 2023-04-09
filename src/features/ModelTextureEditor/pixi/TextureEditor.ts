import * as PIXI from "pixi.js";
import {
  AdjustmentFilter,
  HslAdjustmentFilter,
  OutlineFilter,
} from "pixi-filters";
import { PaintLayer } from "./PaintLayer";
import { saveAs } from "file-saver";
import { Brush, getDefaultBrush } from "./brush";
import { slugify } from "@/pkg/stringUtil";
import { Items, modelFilenamePath, player } from "@/pkg/quake/items";
import { nullOperation } from "@/pkg/functions";
import { BrushChange, EditorEvent, FiltersChange } from "./events";
import { FilterInputs } from "./filter";

export interface TextureEditorSettings {
  containerID: string;
  width: number;
  height: number;
  texturePath: string;
  onReady: () => void;
  onChange: () => void;
}

export class TextureEditor extends PIXI.Application {
  private readonly _containerDiv: HTMLElement;
  private readonly _settings: TextureEditorSettings;
  private readonly _hslAdjustmentFilter: HslAdjustmentFilter =
    new HslAdjustmentFilter();
  private readonly _adjustmentFilter: AdjustmentFilter = new AdjustmentFilter();
  private readonly _blurFilter: PIXI.BlurFilter = new PIXI.BlurFilter();
  private _outlineContainer: PIXI.Container = new PIXI.Container();
  private _textureSprite: PIXI.Sprite = new PIXI.Sprite();
  private _textureContainer: PIXI.Container = new PIXI.Container();
  readonly paint: PaintLayer;
  onReady: () => void = nullOperation;
  onChange: () => void = nullOperation;

  constructor(settings: TextureEditorSettings) {
    const { width, height, containerID } = settings;
    super({ width, height, backgroundAlpha: 0 });
    this._settings = settings;

    // texture
    this._blurFilter.enabled = false;
    this._textureContainer.filters = [
      this._hslAdjustmentFilter,
      this._adjustmentFilter,
      this._blurFilter,
    ];
    this.stage.addChild(this._textureContainer);

    // paint
    this.paint = new PaintLayer(this.renderer, width, height);
    this.paint.onChange = () => this._onChange();
    this.stage.addChild(this.paint.container);

    // outline
    this._outlineContainer.visible = false;
    this._outlineContainer.filters = [
      new OutlineFilter(1, 0x000000, 1, 1, true),
    ];
    this.stage.addChild(this._outlineContainer);

    // HTML elements
    this._containerDiv = document.getElementById(containerID) as HTMLElement;

    const canvas = this.getCanvas();
    canvas.id = `${containerID}-canvas`;
    canvas.classList.add(..."editor-canvas app-dropzone".split(" "));

    // events
    this._listen();

    // callbacks
    this.onChange = settings.onChange;
    this.onReady = settings.onReady;

    // brush
    this.brush = getDefaultBrush();

    // load texture
    this.loadTexture(settings.texturePath).then((texture: PIXI.Texture) => {
      // outline
      this._outlineContainer.scale = this._textureSprite.scale;
      this._outlineContainer.addChild(PIXI.Sprite.from(texture));
    });
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
    const canvas = this.getCanvas();
    const dragClass = "editor-drag";
    const container = this._containerDiv;

    canvas.addEventListener("dragenter", function (event) {
      console.log("dragenter");
      container.classList.add(dragClass);
    });
    canvas.addEventListener("dragleave", function (event) {
      console.log("dragleave");
      container.classList.remove(dragClass);
    });
    this._onFileDrop = this._onFileDrop.bind(this);
    canvas.addEventListener("drop", this._onFileDrop);

    canvas.addEventListener("contextmenu", this._preventDefault);

    this._onBrushChange = this._onBrushChange.bind(this);
    document.addEventListener(EditorEvent.BRUSH_CHANGE, this._onBrushChange);

    this._onFiltersChange = this._onFiltersChange.bind(this);
    document.addEventListener(
      EditorEvent.FILTERS_CHANGE,
      this._onFiltersChange
    );
  }

  private _onFileDrop(event: DragEvent) {
    event.preventDefault();
    this._containerDiv.classList.remove("editor-drag");

    if (!event.dataTransfer) {
      return;
    }

    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter((f) => f.type.startsWith("image"));

    if (0 === imageFiles.length) {
      return;
    }

    this.loadTexture(URL.createObjectURL(imageFiles[0]));
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
    // blur
    this._blurFilter.blur = filters.blur.value;
    this._blurFilter.enabled = filters.blur.enabled;

    // adjustment
    this._adjustmentFilter.brightness = filters.brightness.enabled
      ? filters.brightness.value
      : filters.brightness.defaultValue;
    this._adjustmentFilter.contrast = filters.contrast.enabled
      ? filters.contrast.value
      : filters.contrast.defaultValue;

    // hsl adjustment
    this._hslAdjustmentFilter.hue = filters.hue.enabled
      ? filters.hue.value
      : filters.hue.defaultValue;
    this._hslAdjustmentFilter.saturation = filters.saturation.enabled
      ? filters.saturation.value
      : filters.hue.defaultValue;
    this._hslAdjustmentFilter.colorize =
      filters.hue.enabled && filters.hue.colorize;

    this._onChange();
  }

  async loadTexture(url: string): Promise<PIXI.Texture> {
    const texture: PIXI.Texture = await PIXI.Texture.fromURL(url);
    this._textureSprite?.destroy();
    this._textureSprite = PIXI.Sprite.from(texture);

    const { width, height } = this._settings;
    this._textureSprite.scale.x = width / texture.orig.width;
    this._textureSprite.scale.y = height / texture.orig.height;

    this._textureContainer.addChild(this._textureSprite);

    // callbacks
    this._onChange();
    this.onReady();

    return texture;
  }

  toggleOutline(): void {
    this._outlineContainer.visible = !this._outlineContainer.visible;
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
