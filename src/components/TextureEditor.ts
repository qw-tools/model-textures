import { Stage } from "konva/lib/Stage";
import { Layer } from "konva/lib/Layer";
import { Image as KonvaImage } from "konva/lib/shapes/Image";
import {
  createImageFromURI,
  createImageOutline,
  dataUriFromFile,
} from "./domutil";
import { throttle } from "@google/model-viewer/lib/utilities";
import { FilterSettings } from "./Filter";
import { Filter } from "konva/lib/Node";
import { PaintLayer } from "./Konva/paintLayer";

export interface TextureEditorSettings {
  containerID: string;
  width: number;
  height: number;
  onChange: () => void;
}

class CircleCursor {}

class RectangleCursor {}

// TODO: cursorLayer ?????

export class TextureEditor {
  private readonly helperLayer: Layer;
  public readonly paintLayer: PaintLayer = new PaintLayer();
  private readonly textureLayer: Layer;
  private readonly textureImage: KonvaImage;
  private readonly stage: Stage;
  public readonly textureOutline: KonvaImage;
  public onChange: () => void;

  constructor(settings: TextureEditorSettings) {
    // helper layer
    this.textureOutline = new KonvaImage({
      image: undefined,
      // width: settings.width,
      // height: settings.height,
    });
    this.helperLayer = new Layer({ listening: false });
    this.helperLayer.add(this.textureOutline);

    // texture layer/img
    this.textureImage = new KonvaImage({
      image: undefined,
      width: settings.width,
      height: settings.height,
    });
    this.textureLayer = new Layer({ listening: false });
    this.textureLayer.add(this.textureImage);

    // paint layer
    this.paintLayer.size({
      width: settings.width,
      height: settings.height,
    });

    // stage
    this.stage = new Stage({
      container: settings.containerID,
      width: settings.width,
      height: settings.height,
    });
    this.stage.add(this.textureLayer, this.paintLayer, this.helperLayer);

    // change callback (throttle for performance)
    const throttleLimit = 15; // at most one call per x ms
    this.onChange = throttle(settings.onChange, throttleLimit);

    // events
    this.stage.on("contextmenu", (e) => {
      e.evt.preventDefault();
    });

    const handleMouseEvent = (e: Event) =>
      this.paintLayer.onMouseEvent(e as MouseEvent);
    this.stage.addEventListener("mousemove", throttle(handleMouseEvent, 5));
    this.stage.addEventListener("mousedown", handleMouseEvent);
    this.stage.addEventListener("mouseenter", handleMouseEvent);
    this.stage.addEventListener("mouseleave", handleMouseEvent);
  }

  public setFilterSettings(settings: FilterSettings) {
    this.textureImage.cache();
    const enabledFilters: Filter[] = Object.values(settings)
      .filter((s) => s.enabled)
      .map((s) => s.filter);
    this.textureImage.filters(enabledFilters);

    if (settings.hue.enabled) {
      this.textureImage.hue(settings.hue.value);
    }

    if (settings.saturation.enabled) {
      this.textureImage.saturation(settings.saturation.value);
    }

    if (settings.contrast.enabled) {
      this.textureImage.contrast(settings.contrast.value);
    }

    if (settings.brightness.enabled) {
      this.textureImage.brightness(settings.brightness.value);
    }

    if (settings.blur.enabled) {
      this.textureImage.blurRadius(settings.blur.value);
    }

    this.onChange();
  }

  public toURI(): string {
    this.helperLayer.hide();
    const dataURL = this.stage.toDataURL();
    this.helperLayer.show();
    return dataURL;
  }

  public async setTextureByURI(textureURI: string): Promise<void> {
    const newTextureImage = await createImageFromURI(textureURI);
    this.textureImage.image(newTextureImage);
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

    this.textureOutline.image(newOutlineImage);

    const textureScale = {
      x: this.stage.width() / textureImage.width,
      y: this.stage.height() / textureImage.height,
    };

    this.textureOutline.offset({
      x: strokeOptions.thickness * textureScale.x,
      y: strokeOptions.thickness * textureScale.y,
    });
    this.textureOutline.width(textureScale.x * newOutlineImage.width);
    this.textureOutline.height(textureScale.y * newOutlineImage.height);
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
    this.textureOutline.isVisible()
      ? this.textureOutline.hide()
      : this.textureOutline.show();
  }
}
