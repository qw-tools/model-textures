export type BrushShape = "round" | "square";

export interface BrushSettings {
  color: string;
  shape: BrushShape;
  size: number;
}

export function getDefaultBrushSettings(): BrushSettings {
  return {
    color: "#ff0000",
    size: 24,
    shape: "round",
  };
}
