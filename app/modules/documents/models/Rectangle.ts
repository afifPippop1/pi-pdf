import type { Color, StrokeStyle } from "~/types";
import { Shape } from "../constant/shape";
import { Element } from "./Element";
import { DEFAULT_LINE_WIDTH } from "~/constants";
import { getDashValue, rgbToString } from "~/utils";

class RectangleStyle {
  public color?: Color;
  public outlineColor: Color;
  public strokeWidth: number;
  public strokeStyle: StrokeStyle;

  constructor({
    color,
    outlineColor,
    strokeWidth,
    strokeStyle,
  }: {
    color?: Color;
    outlineColor: Color;
    strokeWidth: number;
    strokeStyle: StrokeStyle;
  }) {
    this.color = color;
    this.outlineColor = outlineColor;
    this.strokeWidth = strokeWidth;
    this.strokeStyle = strokeStyle;
  }
}

export class RectangleElement extends Element {
  public style = new RectangleStyle({
    outlineColor: { r: 0, g: 0, b: 0, a: 1 },
    strokeWidth: 1,
    strokeStyle: "line",
  });
  constructor(
    id: string,
    public x: number,
    public y: number,
    public height: number,
    public width: number
  ) {
    super(id, Shape.RECTANGLE);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.lineWidth = this.style.strokeWidth || DEFAULT_LINE_WIDTH;
    ctx.strokeStyle = rgbToString(this.style.outlineColor);
    if (this.style.color) {
      ctx.fillStyle = rgbToString(this.style.color);
    }
    const dash = getDashValue(this.style.strokeStyle);

    if (dash) {
      ctx.setLineDash(dash);
    }

    ctx.strokeRect(this.x, this.y, this.width, this.height);
    if (this.style.color) {
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    ctx.restore();
  }

  resizeTo(x: number, y: number): void {
    this.width = x - this.x;
    this.height = y - this.y;
  }

  moveTo(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  scaleBy(sx: number, sy: number, originX: number, originY: number): void {}

  containPoint(x: number, y: number): boolean {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }

  drawHighlight(ctx: CanvasRenderingContext2D): void {
    const padding = 8;
    ctx.save();
    const x = this.x - padding;
    const y = this.y - padding;
    const width = this.width + padding * 2;
    const height = this.height + padding * 2;
    ctx.lineWidth = this.style.strokeWidth || DEFAULT_LINE_WIDTH;
    ctx.strokeStyle = "#007bff";

    ctx.strokeRect(x, y, width, height);
    ctx.restore();
  }

  normalize(x: number, y: number): void {
    if (this.x > x) {
      this.x = x;
      this.width = Math.abs(this.width);
    }
    if (this.y > y) {
      this.y = y;
      this.height = Math.abs(this.height);
    }
  }
}
