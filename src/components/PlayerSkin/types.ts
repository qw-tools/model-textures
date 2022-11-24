import Konva from "konva";
import { ModelViewerElement } from "@google/model-viewer";
import { Texture } from "@google/model-viewer/lib/features/scene-graph/texture";
import { dataUriFromFile } from "../util";
import { throttle } from "@google/model-viewer/lib/utilities";

export type BrushShape = "round" | "square";

export interface BrushSettings {
  color: string;
  shape: BrushShape;
  size: number;
}

const MOUSE_BUTTON_PRIMARY = 1;

export interface PlayerTextureEditorSettings {
  containerID: string;
  width: number;
  height: number;
  onChange: () => void;
}

export class PlayerTextureEditor {
  public readonly stage: Konva.Stage;
  private readonly paintLayer: Konva.Layer;
  private readonly textureLayer: Konva.Layer;
  private readonly textureImage: Konva.Image;
  public onChange: () => void;

  constructor(settings: PlayerTextureEditorSettings) {
    // paint layer
    this.paintLayer = new Konva.Layer();

    // texture
    this.textureImage = new Konva.Image({ image: undefined });
    this.textureLayer = new Konva.Layer();
    this.textureLayer.add(this.textureImage);

    // stage
    this.stage = new Konva.Stage({
      container: settings.containerID,
      width: settings.width,
      height: settings.height,
    });
    this.stage.add(this.textureLayer, this.paintLayer);

    // change callback (throttle for performance)
    const throttleLimit = 50; // x ms per call
    this.onChange = throttle(settings.onChange, throttleLimit);

    // events
    const handleMouseEvent = (e: Event) => this.onMouseMove(e as MouseEvent);
    this.stage.addEventListener("mousemove", handleMouseEvent);
    this.stage.addEventListener("mousedown", handleMouseEvent);
  }

  private onMouseMove(event: MouseEvent): void {
    if (event.buttons !== MOUSE_BUTTON_PRIMARY) {
      return;
    }

    this.paintPosition(this.stage.getRelativePointerPosition());
  }

  private paintPosition(pos: { x: number; y: number }): void {
    const props = {
      x: pos.x,
      y: pos.y,
      fill: "red",
      radius: 10,
    };
    this.paintLayer.add(new Konva.Circle(props));
    this.onChange();
  }

  public toURI(): string {
    return this.stage.toDataURL();
  }

  public async setTextureByURI(textureURI: string): Promise<void> {
    const onChange = this.onChange;
    const layer = this.textureLayer;

    return new Promise((resolve) => {
      Konva.Image.fromURL(textureURI, function (img: any) {
        layer.destroyChildren();
        img.setWidth(layer.width());
        img.setHeight(layer.height());
        layer.add(img);
        onChange();
        resolve();
      });
    });
  }

  public async setTextureByFile(textureFile: File): Promise<void> {
    const textureURI = await dataUriFromFile(textureFile);
    return this.setTextureByURI(textureURI);
  }

  public clearPainting(): void {
    this.paintLayer.destroyChildren();
    this.onChange();
  }
}

export class QuakeModelViewer {
  private readonly viewer: ModelViewerElement;

  constructor(containerID: string) {
    this.viewer = document.getElementById(containerID) as ModelViewerElement;
  }

  public setTexture(texture: Texture): void {
    if (!this.viewer.model || 0 === this.viewer.model.materials.length) {
      return;
    }

    this.viewer.model.materials[0].pbrMetallicRoughness.baseColorTexture.setTexture(
      texture
    );
  }

  public async setTextureByURI(textureURI: string): Promise<void> {
    const texture = await this.viewer.createTexture(textureURI);

    if (texture) {
      this.setTexture(texture);
    }
  }

  public async setTextureByFile(textureFile: File): Promise<void> {
    const textureURI = await dataUriFromFile(textureFile);
    return this.setTextureByURI(textureURI);
  }
}

// helpers
// - texture outline
// texture
// - effects
// - drawing
// - regions
// ---- helmet
// ---- etc
// - skin
