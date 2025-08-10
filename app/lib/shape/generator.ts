import { Line } from "./line";
import { Rectangle, type Color } from "./rectangle";

export class ShapeGenerator {
  constructor() {}

  rectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    options?: { color?: Partial<Color> }
  ): Rectangle {
    return new Rectangle(x, y, width, height, options);
  }
  line(x1: number, y1: number, x2: number, y2: number): Line {
    return new Line(x1, y1, x2, y2);
  }
}

export type Drawable = Rectangle | Line;

export const shapeGenerator = () => new ShapeGenerator();
