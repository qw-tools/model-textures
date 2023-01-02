import { FederatedMouseEvent } from "pixi.js";
import { Point2D } from "./math";

export function eventToPosition(e: FederatedMouseEvent): Point2D {
  return { x: e.global.x, y: e.global.y };
}
