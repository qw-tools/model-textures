export type Point2D = {
  x: number;
  y: number;
};

export type Brush = {
  size: number;
  color: string;
  smoothing: number;
  shape: string;
};

export function getDefaultBrush(): Brush {
  return {
    color: "#ff0000",
    size: 24,
    shape: "round",
    smoothing: 0.5,
  };
}

export enum EditorEvent {
  BRUSH_CHANGE = "Editor.BRUSH_CHANGE",
  FILTERS_CHANGE = "Editor.FILTERS_CHANGE",
}
