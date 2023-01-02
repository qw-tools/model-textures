import { Brush } from "./brush";
import { FilterInputs } from "./filter";

export enum EditorEvent {
  BRUSH_CHANGE = "Editor.BRUSH_CHANGE",
  FILTERS_CHANGE = "Editor.FILTERS_CHANGE",
}

export class BrushChange extends Event {
  brush: Brush;

  constructor(brush: Brush) {
    super(EditorEvent.BRUSH_CHANGE);
    this.brush = brush;
  }
}

export class FiltersChange extends Event {
  filters: FilterInputs;

  constructor(filters: FilterInputs) {
    super(EditorEvent.FILTERS_CHANGE);
    this.filters = filters;
  }
}
