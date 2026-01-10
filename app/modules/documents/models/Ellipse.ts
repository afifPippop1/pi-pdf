import { Shape } from "../constant/shape";
import { Element } from "./Element";

export class EllipseElement extends Element {
  constructor(
    id: string,
    public x1: number,
    public y1: number,
    public x2: number,
    public y2: number
  ) {
    super(id, Shape.ELLIPSE);
  }

  get width() {
    return (this.x2 - this.x1) / 2;
  }

  get height() {
    return (this.y2 - this.y1) / 2;
  }

  get x() {
    return this.x1 + this.width;
  }

  get y() {
    return this.y1 + this.height;
  }

  get radiusX() {
    return Math.abs(this.x2 - this.x1) / 2;
  }

  get radiusY() {
    return Math.abs(this.y2 - this.y1) / 2;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  resizeTo(x: number, y: number): void {
    this.x2 = x;
    this.y2 = y;
  }

  moveTo(dx: number, dy: number): void {}

  scaleBy(sx: number, sy: number, originX: number, originY: number): void {}

  containPoint(x: number, y: number): boolean {
    return x >= this.x1 && x <= this.x2 && y >= this.y1 && y <= this.y2;
  }

  drawHighlight(ctx: CanvasRenderingContext2D): void {}
}
