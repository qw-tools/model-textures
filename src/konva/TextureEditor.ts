import { Stage } from "konva/lib/Stage";
import { Layer } from "konva/lib/Layer";
import { Image as KonvaImage } from "konva/lib/shapes/Image";
import {
  createImageFromURI,
  createImageOutline,
  dataUriFromFile,
} from "../components/domutil";
import { throttle } from "@google/model-viewer/lib/utilities";
import { FilterSettings } from "./Filter";
import { Filter } from "konva/lib/Node";
import { PaintLayer } from "./PaintLayer";
import { CursorLayer } from "./CursorLayer";
import { Brush, getDefaultBrush } from "./Brush";

export interface TextureEditorSettings {
  containerID: string;
  width: number;
  height: number;
  onChange: () => void;
}

export class TextureEditor {
  private readonly helperLayer: Layer;
  private readonly cursorLayer: CursorLayer;
  public readonly paintLayer: PaintLayer;
  private readonly modelTextureLayer: Layer;
  private readonly modelTexture: KonvaImage;
  private readonly stage: Stage;
  public readonly modelTextureOutline: KonvaImage;
  private _brush: Brush = getDefaultBrush();
  public onChange: () => void;

  constructor(settings: TextureEditorSettings) {
    // change callback (throttle for performance)
    const throttleLimit = 15; // at most one call per x ms
    this.onChange = throttle(settings.onChange, throttleLimit);

    // cursor
    this.cursorLayer = new CursorLayer();

    // helper layer
    this.modelTextureOutline = new KonvaImage({ image: undefined });
    this.helperLayer = new Layer({ listening: false });
    this.helperLayer.add(this.modelTextureOutline);

    // shared properties
    const editorSize = {
      width: settings.width,
      height: settings.height,
    };

    // texture layer/img
    this.modelTexture = new KonvaImage({
      image: undefined,
      ...editorSize,
    });
    this.modelTextureLayer = new Layer({ listening: false });
    this.modelTextureLayer.add(this.modelTexture);

    // paint layer
    this.paintLayer = new PaintLayer();
    this.paintLayer.onPaint = this.onChange;
    this.paintLayer.size(editorSize);

    // stage
    this.stage = new Stage({
      container: settings.containerID,
      ...editorSize,
    });
    this.stage.add(
      this.modelTextureLayer,
      this.paintLayer,
      this.helperLayer,
      this.cursorLayer
    );

    // events
    this.stage.on("contextmenu", (e) => {
      e.evt.preventDefault();
    });

    const handleMouseEvent = (e: Event): void => {
      this.paintLayer.onMouseEvent(e as MouseEvent);
      this.cursorLayer.onMouseEvent(e as MouseEvent);
    };

    this.stage.addEventListener("mousemove", throttle(handleMouseEvent, 5));
    this.stage.addEventListener("mousedown", handleMouseEvent);
    this.stage.addEventListener("mouseenter", handleMouseEvent);
    this.stage.addEventListener("mouseleave", handleMouseEvent);
  }

  get brush(): Brush {
    return this._brush;
  }

  set brush(value: Brush) {
    this._brush = value;
    this.paintLayer.brush = value;
    this.cursorLayer.brush = value;
  }

  public applyFilters(filters: FilterSettings) {
    this.modelTexture.cache();
    const enabledFilters: Filter[] = Object.values(filters)
      .filter((s) => s.enabled)
      .map((s) => s.filter);
    this.modelTexture.filters(enabledFilters);

    if (filters.hue.enabled) {
      this.modelTexture.hue(filters.hue.value);
    }

    if (filters.saturation.enabled) {
      this.modelTexture.saturation(filters.saturation.value);
    }

    if (filters.contrast.enabled) {
      this.modelTexture.contrast(filters.contrast.value);
    }

    if (filters.brightness.enabled) {
      this.modelTexture.brightness(filters.brightness.value);
    }

    if (filters.blur.enabled) {
      this.modelTexture.blurRadius(filters.blur.value);
    }

    this.onChange();
  }

  public toURI(): string {
    this.helperLayer.hide();
    this.cursorLayer.hide();
    const dataURL = this.stage.toDataURL();
    this.helperLayer.show();
    this.cursorLayer.show();
    return dataURL;
  }

  public async setTextureByURI(textureURI: string): Promise<void> {
    const newTextureImage = await createImageFromURI(textureURI);
    this.modelTexture.image(newTextureImage);
    await this.updateOutline(newTextureImage);
    this.onChange();
  }

  private async updateOutline(textureImage: HTMLImageElement): Promise<void> {
    const strokeOptions = {
      thickness: 1,
      color: "#000000",
    };
    const newOutlineImage = await createImageOutline(
      textureImage,
      strokeOptions
    );

    this.modelTextureOutline.image(newOutlineImage);

    const textureScale = {
      x: this.stage.width() / textureImage.width,
      y: this.stage.height() / textureImage.height,
    };

    this.modelTextureOutline.offset({
      x: strokeOptions.thickness * textureScale.x,
      y: strokeOptions.thickness * textureScale.y,
    });
    this.modelTextureOutline.width(textureScale.x * newOutlineImage.width);
    this.modelTextureOutline.height(textureScale.y * newOutlineImage.height);
  }

  public async setTextureByFile(textureFile: File): Promise<void> {
    const textureURI = await dataUriFromFile(textureFile);
    return this.setTextureByURI(textureURI);
  }

  public clearPainting(): void {
    this.paintLayer.paint.destroyChildren();
    this.onChange();
  }

  public toggleTextureOutline(): void {
    this.modelTextureOutline.isVisible()
      ? this.modelTextureOutline.hide()
      : this.modelTextureOutline.show();
  }
}
