export interface Texture {
  index: number;
  filename: string;
  width: number;
  height: number;
}

export interface Model {
  filename: string;
  textures: Texture[];
}
