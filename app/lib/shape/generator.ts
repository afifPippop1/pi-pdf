import { Line } from "./line";
import { Rectangle } from "./rectangle";

export class ShapeGenerator {
  constructor() {}

  rectangle(x: number, y: number, width: number, height: number): Rectangle {
    return new Rectangle(x, y, width, height);
  }
  line(x1: number, y1: number, x2: number, y2: number): Line {
    return new Line(x1, y1, x2, y2);
  }
}

export type Drawable = Rectangle | Line;

export const shapeGenerator = () => new ShapeGenerator();
