import type { ShapeType } from "../types/shape.type";

export abstract class Element {
  id: string;
  type: ShapeType;

  constructor(id: string, type: ShapeType) {
    this.id = id;
    this.type = type;
  }

  abstract draw(ctx: CanvasRenderingContext2D): void;
  abstract drawHighlight(ctx: CanvasRenderingContext2D): void;

  abstract resizeTo(x: number, y: number): void;

  abstract moveTo(x: number, y: number): void;
  abstract scaleBy(
    sx: number,
    sy: number,
    originX: number,
    originY: number
  ): void;

  abstract containPoint(x: number, y: number): boolean;

  abstract normalize(x: number, y: number): void;

  abstract getLocalPosition(x: number, y: number): { x: number; y: number };

  abstract toJson(): any;
}
