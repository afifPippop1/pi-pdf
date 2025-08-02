import { Rectangle } from "./rectangle";

export class ShapeGenerator {
  constructor() {}

  rectangle(x1: number, x2: number, width: number, height: number): Rectangle {
    return new Rectangle(x1, x2, width, height);
  }
}

export type Drawable = Rectangle;

export const shapeGenerator = () => new ShapeGenerator();
