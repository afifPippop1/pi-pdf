import type { ShapeType } from "../types/shape.type";

export abstract class Element {
  id: string;
  type: ShapeType;

  constructor(id: string, type: ShapeType) {
    this.id = id;
    this.type = type;
  }

  abstract draw(ctx: CanvasRenderingContext2D): void;
  abstract resizeTo(x: number, y: number): void;
}
