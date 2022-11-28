import { Stage } from "konva/lib/Stage";
import { Layer } from "konva/lib/Layer";
import { Image as KonvaImage } from "konva/lib/shapes/Image";
import {
  createImageFromURI,
  createImageOutline,
  dataUriFromFile,
} from "./domutil";
import { throttle } from "@google/model-viewer/lib/utilities";
import { BrushSettings, getDefaultBrushSettings } from "./Brush";
import { FilterSettings } from "./Filter";
import { Filter } from "konva/lib/Node";
import { Line } from "konva/lib/shapes/Line";

enum MouseButton {
  Primary = 1,
  Secondary = 2,
}

enum MouseEventType {
  Move = "mousemove",
  Down = "mousedown",
  Enter = "mouseenter",
}

export interface TextureEditorSettings {
  containerID: string;
  width: number;
  height: number;
  onChange: () => void;
}

export class TextureEditor {
  private readonly helperLayer: Layer;
  private readonly paintLayer: Layer;
  private readonly textureLayer: Layer;
  private readonly textureImage: KonvaImage;
  private readonly stage: Stage;
  private paintLastLine: Line;
  public readonly textureOutline: KonvaImage;
  public brush: BrushSettings;
  public onChange: () => void;

  constructor(settings: TextureEditorSettings) {
    // brush settings
    this.brush = getDefaultBrushSettings();

    // helper layer
    this.textureOutline = new KonvaImage({
      image: undefined,
      // width: settings.width,
      // height: settings.height,
    });
    this.helperLayer = new Layer({ listening: false });
    this.helperLayer.add(this.textureOutline);

    // paint layer
    this.paintLastLine = new Line();
    this.paintLayer = new Layer({ listening: false });

    // texture layer/img
    this.textureImage = new KonvaImage({
      image: undefined,
      width: settings.width,
      height: settings.height,
    });
    this.textureLayer = new Layer({ listening: false });
    this.textureLayer.add(this.textureImage);

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

    const handleMouseEvent = (e: Event) => this.onMouseEvent(e as MouseEvent);

    this.stage.addEventListener(MouseEventType.Move, handleMouseEvent);
    this.stage.addEventListener(MouseEventType.Down, handleMouseEvent);
    this.stage.addEventListener(MouseEventType.Enter, handleMouseEvent);
  }

  private onMouseEvent(event: MouseEvent): void {
    const isPrimary = event.buttons === MouseButton.Primary;
    const isSecondary = event.buttons === MouseButton.Secondary;

    if (!(isPrimary || isSecondary)) {
      return;
    }

    const pos = this.stage.getRelativePointerPosition();

    if (MouseEventType.Move === event.type) {
      this.paintExtend(pos);
    } else {
      const paintType = isPrimary ? "add" : "erase";
      this.paintNew(pos, paintType);
    }
  }

  private paintNew(pos: { x: number; y: number }, paintType: string): void {
    const globalCompositeOperation =
      paintType === "add" ? "source-over" : "destination-out";

    this.paintLastLine = new Line({
      stroke: this.brush.color,
      strokeWidth: this.brush.size,
      globalCompositeOperation,
      lineCap: this.brush.shape,
      lineJoin: "round", // round join for smoother lines
      // add point twice, so we have some drawings even on a simple click
      points: [pos.x, pos.y, pos.x, pos.y],
      listening: false,
    });
    this.paintLayer.add(this.paintLastLine);
    this.onChange();
  }

  private paintExtend(pos: { x: number; y: number }): void {
    const newPoints = this.paintLastLine.points().concat([pos.x, pos.y]);
    this.paintLastLine.points(newPoints);
    this.onChange();
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
    this.paintLayer.destroyChildren();
    this.onChange();
  }

  public toggleTextureOutline(): void {
    this.textureOutline.isVisible()
      ? this.textureOutline.hide()
      : this.textureOutline.show();
  }
}
