import type { Color, StrokeStyle } from "~/types";
import { Element } from "./Element";
import { Shape } from "../constant/shape";
import { DEFAULT_LINE_WIDTH } from "~/constants";
import { getDashValue, rgbToString } from "~/utils";

export class LineStyle {
  public color: Color;
  public strokeWidth: number;
  public strokeStyle: StrokeStyle;
  constructor({
    color,
    strokeWidth,
    strokeStyle,
  }: {
    color: Color;
    strokeWidth: number;
    strokeStyle: StrokeStyle;
  }) {
    this.color = color;
    this.strokeWidth = strokeWidth;
    this.strokeStyle = strokeStyle;
  }
}

export class LineElement extends Element {
  public style: LineStyle = new LineStyle({
    color: { r: 0, g: 0, b: 0, a: 1 },
    strokeWidth: 1,
    strokeStyle: "line",
  });
  constructor(
    id: string,
    public x1: number,
    public y1: number,
    public x2: number,
    public y2: number
  ) {
    super(id, Shape.LINE);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);

    ctx.lineWidth = this.style.strokeWidth || DEFAULT_LINE_WIDTH;
    ctx.strokeStyle = rgbToString(this.style.color);

    const dash = getDashValue(this.style.strokeStyle);
    ctx.setLineDash(dash ?? []);

    ctx.stroke();
  }

  resizeTo(x: number, y: number): void {
    this.x2 = x;
    this.y2 = y;
  }

  moveTo(dx: number, dy: number): void {}

  scaleBy(sx: number, sy: number, originX: number, originY: number): void {}

  containPoint(x: number, y: number): boolean {
    const x1 = this.x1;
    const y1 = this.y1;
    const x2 = this.x2;
    const y2 = this.y2;

    const dx = x2 - x1;
    const dy = y2 - y1;

    // Handle zero-length line (dot)
    if (dx === 0 && dy === 0) {
      const dist = Math.hypot(x - x1, y - y1);
      return dist <= Math.max(this.style.strokeWidth, 6);
    }

    // Project point onto the line segment
    const t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);

    // Clamp t to segment [0, 1]
    const clampedT = Math.max(0, Math.min(1, t));

    const closestX = x1 + clampedT * dx;
    const closestY = y1 + clampedT * dy;

    const distance = Math.hypot(x - closestX, y - closestY);

    const tolerance = Math.max(this.style.strokeWidth, 6);

    return distance <= tolerance;
  }

  drawHighlight(ctx: CanvasRenderingContext2D): void {}
}
