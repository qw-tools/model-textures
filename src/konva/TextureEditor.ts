import { Stage } from "konva/lib/Stage";
import { Layer } from "konva/lib/Layer";
import { Image as KonvaImage } from "konva/lib/shapes/Image";
import {
  createImageFromURI,
  createImageOutline,
  dataUriFromFile,
} from "../components/domutil";
import { throttle } from "@google/model-viewer/lib/utilities";
import { PaintLayer } from "./PaintLayer";
import { CursorLayer } from "./CursorLayer";
import { Brush, getDefaultBrush } from "./Brush";
import { nullOperation } from "../components/util";
import { saveAs } from "file-saver";
import { CssFilter } from "../components/CssFilter";

export interface TextureEditorSettings {
  containerID: string;
  width: number;
  height: number;
  texturePath: string;
  onChange?: () => void;
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
  private _onChange: () => void = nullOperation;

  constructor(settings: TextureEditorSettings) {
    // change callback
    if (settings.onChange) {
      this.onChange = settings.onChange;
    }

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

    // init
    this.setTextureByURI(settings.texturePath);
    this.brush = getDefaultBrush();
  }

  get onChange(): () => void {
    return this._onChange;
  }

  set onChange(callback: () => void) {
    const throttleLimit = 15; // at most one call per x ms
    this._onChange = throttle(callback, throttleLimit);
  }

  get brush(): Brush {
    return this._brush;
  }

  set brush(value: Brush) {
    this._brush = value;
    this.paintLayer.brush = value;
    this.cursorLayer.brush = value;
  }

  public applyCSSFilters(filters: CssFilter[]): void {
    const enabledFilters = filters.filter((f) => f.enabled);
    let filterStr;

    if (enabledFilters.length > 0) {
      filterStr = enabledFilters.map((f) => f.toString()).join(" ");
    } else {
      filterStr = "none";
    }

    console.log("filter", filterStr);

    this.modelTextureLayer.getContext().setAttr("filter", filterStr);
    this.modelTextureLayer.draw();
    this.onChange();
  }

  public toURI(): string {
    const result = document.createElement("canvas");
    result.width = this.stage.width();
    result.height = this.stage.height();

    const ctx = result.getContext("2d");
    const texture = this.modelTextureLayer.getNativeCanvasElement();
    const paint = this.paintLayer.getNativeCanvasElement();
    ctx?.drawImage(texture, 0, 0, result.width, result.height);
    ctx?.drawImage(paint, 0, 0, result.width, result.height);

    return result.toDataURL();
  }

  public download(filename = ""): void {
    saveAs(this.toURI(), filename || "download");
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

  public clearPaint(): void {
    this.paintLayer.destroyChildren();
    this.paintLayer.draw();
    this.onChange();
  }

  public toggleTextureOutline(): void {
    this.modelTextureOutline.isVisible()
      ? this.modelTextureOutline.hide()
      : this.modelTextureOutline.show();
  }
}
