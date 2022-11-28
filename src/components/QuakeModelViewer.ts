import { ModelViewerElement } from "@google/model-viewer";
import { Texture } from "@google/model-viewer/lib/features/scene-graph/texture";
import { dataUriFromFile } from "./domutil";

export interface QuakeModelViewerSettings {
  containerID: string;
  modelPath: string;
  texturePath?: string;
}

export class QuakeModelViewer {
  private readonly viewer: ModelViewerElement;

  constructor(settings: QuakeModelViewerSettings) {
    this.viewer = document.getElementById(
      settings.containerID
    ) as ModelViewerElement;
    this.viewer.setAttribute("src", settings.modelPath);
    this.viewer.addEventListener("load", () => this.onViewerLoaded(settings));
  }

  public async onViewerLoaded(
    settings: QuakeModelViewerSettings
  ): Promise<void> {
    if (settings.texturePath) {
      await this.setTextureByURI(settings.texturePath);
    }
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
