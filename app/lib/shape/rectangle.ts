import type { Color, RectangleProperties } from "~/types";

const defaultColor = {
  b: 255,
  g: 255,
  r: 255,
  a: 1,
};

export class Rectangle {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public options: RectangleProperties
  ) {}
}
