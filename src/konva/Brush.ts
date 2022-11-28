export type BrushShape = "round" | "square" | "";

export interface Brush {
  color: string;
  shape: BrushShape;
  size: number;
}

export function getDefaultBrush(): Brush {
  return {
    color: "#ff0000",
    size: 24,
    shape: "round",
  };
}
