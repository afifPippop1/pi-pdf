import type { Color, LineProperties, RectangleProperties } from "~/types";
import { Line } from "./line";
import { Rectangle } from "./rectangle";

export class ShapeGenerator {
  constructor() {}

  rectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    options: RectangleProperties
  ): Rectangle {
    return new Rectangle(x, y, width, height, options);
  }
  line(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options: LineProperties
  ): Line {
    return new Line(x1, y1, x2, y2, options);
  }
}

export type Drawable = Rectangle | Line;

export const shapeGenerator = () => new ShapeGenerator();
