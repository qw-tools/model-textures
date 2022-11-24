import { Stage } from "konva/lib/Stage";
import { Layer } from "konva/lib/Layer";
import { Image as KonvaImage } from "konva/lib/shapes/Image";
import { Circle } from "konva/lib/shapes/Circle";
import { Rect } from "konva/lib/shapes/Rect";
import {
  createImageFromURI,
  createImageOutline,
  dataUriFromFile,
} from "./domutil";
import { throttle } from "@google/model-viewer/lib/utilities";
import { Shape } from "konva/lib/Shape";
import { BrushSettings, getDefaultBrushSettings } from "./Brush";
import { Filter } from "konva/lib/Node";

export interface TextureEditorSettings {
  containerID: string;
  width: number;
  height: number;
  onChange: () => void;
}

export class TextureEditor {
  public readonly stage: Stage;
  private readonly helperLayer: Layer;
  private readonly outlineImage: KonvaImage;
  private readonly paintLayer: Layer;
  private readonly textureLayer: Layer;
  private readonly textureImage: KonvaImage;
  public brush: BrushSettings;
  public onChange: () => void;

  constructor(settings: TextureEditorSettings) {
    // brush settings
    this.brush = getDefaultBrushSettings();

    // helper layer
    this.outlineImage = new KonvaImage({
      image: undefined,
      // width: settings.width,
      // height: settings.height,
    });
    this.helperLayer = new Layer({ listening: false });
    this.helperLayer.add(this.outlineImage);

    // paint layer
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
    const handleMouseEvent = (e: Event) => this.onMouseEvent(e as MouseEvent);
    this.stage.addEventListener("mousemove", handleMouseEvent);
    this.stage.addEventListener("mousedown", handleMouseEvent);
  }

  private onMouseEvent(event: MouseEvent): void {
    const MOUSE_BUTTON_PRIMARY = 1;

    if (event.buttons !== MOUSE_BUTTON_PRIMARY) {
      return;
    }

    this.paintByPosition(this.stage.getRelativePointerPosition());
  }

  private paintByPosition(pos: { x: number; y: number }): void {
    const props = {
      ...pos,
      fill: this.brush.color,
      listening: false,
      perfectDrawEnabled: false,
    };

    let shape: Shape;

    if ("square" === this.brush.shape) {
      shape = new Rect({
        ...props,
        width: this.brush.size,
        height: this.brush.size,
      });
    } else {
      shape = new Circle({
        ...props,
        radius: this.brush.size / 2,
      });
    }

    this.paintLayer.add(shape);
    shape.cache();
    this.onChange();
  }

  set setFilters(filters: Filter[]) {
    this.textureLayer.filters(filters);
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

  public async updateOutline(textureImage: HTMLImageElement): Promise<void> {
    const strokeOptions = {
      thickness: 1,
      color: "#000000",
    };
    const newOutlineImage = await createImageOutline(
      textureImage,
      strokeOptions
    );

    this.outlineImage.image(newOutlineImage);

    const textureScale = {
      x: this.stage.width() / textureImage.width,
      y: this.stage.height() / textureImage.height,
    };

    this.outlineImage.offset({
      x: strokeOptions.thickness * textureScale.x,
      y: strokeOptions.thickness * textureScale.y,
    });
    this.outlineImage.width(textureScale.x * newOutlineImage.width);
    this.outlineImage.height(textureScale.y * newOutlineImage.height);
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
    this.outlineImage.isVisible()
      ? this.outlineImage.hide()
      : this.outlineImage.show();
  }
}
