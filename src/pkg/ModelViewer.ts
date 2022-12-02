import { ModelViewerElement } from "@google/model-viewer";
import { Texture } from "@google/model-viewer/lib/features/scene-graph/texture";
import { dataURLFromFile } from "./domUtil";

export interface ModelViewerTexture {
  path: string;
  index: number;
}

export interface ModelViewerSettings {
  containerID: string;
  modelPath: string;
  textures?: ModelViewerTexture[];
}

export class ModelViewer {
  private readonly viewer: ModelViewerElement;

  constructor(settings: ModelViewerSettings) {
    this.viewer = document.getElementById(
      settings.containerID
    ) as ModelViewerElement;
    this.viewer.setAttribute("src", settings.modelPath);
    this.viewer.addEventListener("load", () => this.onViewerLoaded(settings));
  }

  public async onViewerLoaded(settings: ModelViewerSettings): Promise<void> {
    if (settings.textures && settings.textures.length > 0) {
      for (let i = 0; i < settings.textures.length; i++) {
        await this.setTextureByURI(
          settings.textures[i].path,
          settings.textures[i].index
        );
      }
    }
  }

  public setTexture(texture: Texture, materialIndex = 0): void {
    if (
      !this.viewer.model ||
      materialIndex >= this.viewer.model.materials.length
    ) {
      return;
    }

    this.viewer.model.materials[
      materialIndex
    ].pbrMetallicRoughness.baseColorTexture.setTexture(texture);
  }

  public async setTextureByURI(
    textureURI: string,
    materialIndex = 0
  ): Promise<void> {
    const texture = await this.viewer.createTexture(textureURI);

    if (texture) {
      this.setTexture(texture, materialIndex);
    }
  }

  public async setTextureByFile(textureFile: File): Promise<void> {
    const textureURI = await dataURLFromFile(textureFile);
    return this.setTextureByURI(textureURI);
  }
}
