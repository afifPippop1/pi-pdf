import type { Drawable } from "~/lib/shape";
import type { ToolType } from "./toolType";

export interface Coordinate2D {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export interface Element extends Coordinate2D {
  id: string;
  element: Drawable;
  type: ToolType;
  pdfCoordinate: Coordinate2D;
}
