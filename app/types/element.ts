import type { toolTypes } from "~/constants";
import type { Drawable, Line, Rectangle } from "~/lib/shape";

export interface Coordinate2D {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface LineElement extends Coordinate2D {
  element: Line;
  type: typeof toolTypes.LINE;
}

export interface RectangleElement extends Coordinate2D {
  element: Rectangle;
  type: typeof toolTypes.RECTANGLE;
}

export interface ShapeElement extends Coordinate2D {
  element: Drawable;
  type: typeof toolTypes.LINE | typeof toolTypes.RECTANGLE;
}

export interface TextElement extends Pick<Coordinate2D, "x1" | "y1"> {
  type: typeof toolTypes.TEXT;
  text: string;
}

export type ElementType = LineElement | RectangleElement | TextElement;

export type Element<T extends ElementType = ElementType> = T & {
  id: string;
};
