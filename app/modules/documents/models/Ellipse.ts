import { DEFAULT_LINE_WIDTH } from "~/constants";
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

  moveTo(x: number, y: number): void {
    const cx = this.x;
    const cy = this.y;

    const dx = x - cx;
    const dy = y - cy;

    this.x1 += dx;
    this.y1 += dy;
    this.x2 += dx;
    this.y2 += dy;
  }

  scaleBy(sx: number, sy: number, originX: number, originY: number): void {}

  containPoint(x: number, y: number): boolean {
    return x >= this.x1 && x <= this.x2 && y >= this.y1 && y <= this.y2;
  }

  drawHighlight(ctx: CanvasRenderingContext2D): void {
    const padding = 8;
    ctx.save();
    const x = this.x1 - padding;
    const y = this.y1 - padding;
    const width = this.x2 - this.x1 + padding * 2;
    const height = this.y2 - this.y1 + padding * 2;
    ctx.lineWidth = DEFAULT_LINE_WIDTH;
    ctx.strokeStyle = "#007bff";

    ctx.strokeRect(x, y, width, height);
    ctx.restore();
  }

  normalize(x: number, y: number): void {}

  getLocalPosition(x: number, y: number): { x: number; y: number } {
    // Get Position based on center
    x = x - this.x;
    y = y - this.y;

    return { x, y };
  }

  toJson() {
    return {
      id: this.id,
      type: this.type,
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2,
    };
  }

  static fromJson(json: any): Element {
    return new EllipseElement(json.id, json.x1, json.y1, json.x2, json.y2);
  }
}
