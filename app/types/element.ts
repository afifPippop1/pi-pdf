import type { strokeStyle, toolTypes } from "~/constants";
import type { Drawable, Line, Rectangle } from "~/lib/shape";
import type { Color } from "./common";

export interface BaseCoordinate {
  x: number;
  y: number;
}

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

export type StrokeStyle = (typeof strokeStyle)[keyof typeof strokeStyle];

export type LineProperties = {
  color: Color;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
};

export type RectangleProperties = {
  color: Color;
  outlineColor: Color;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
};

export interface RectangleElement extends Coordinate2D {
  element: Rectangle;
  type: typeof toolTypes.RECTANGLE;
}

export interface ShapeElement extends Coordinate2D {
  element: Drawable;
  type: typeof toolTypes.LINE | typeof toolTypes.RECTANGLE;
}

export interface TextProperties {
  fontFamily: string;
  bold: boolean;
  italic: boolean;
  fontSize: number;
}

export interface TextElement extends Pick<Coordinate2D, "x1" | "y1"> {
  type: typeof toolTypes.TEXT;
  text: string;
  properties: TextProperties;
}

export type ElementType = LineElement | RectangleElement | TextElement;

export type Element<T extends ElementType = ElementType> = T & {
  id: string;
};
