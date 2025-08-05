import type { Drawable } from "~/lib/shape";
import type { ToolType } from "./toolType";

export interface Element {
  id: string;
  element: Drawable;
  type: ToolType;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}
