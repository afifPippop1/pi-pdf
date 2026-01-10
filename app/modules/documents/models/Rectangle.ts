import { DEFAULT_LINE_WIDTH } from "~/constants";
import type { Color, StrokeStyle } from "~/types";
import { getDashValue, rgbToString } from "~/utils";
import { Shape } from "../constant/shape";
import { Element } from "./Element";

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
    ctx.save();
    const x = this.x - this.PADDING;
    const y = this.y - this.PADDING;
    const width = this.width + this.PADDING * 2;
    const height = this.height + this.PADDING * 2;
    ctx.lineWidth = DEFAULT_LINE_WIDTH;
    ctx.strokeStyle = "#007bff";

    ctx.strokeRect(x, y, width, height);
    ctx.restore();
  }

  normalize(): void {
    if (this.width < 0) {
      this.width = Math.abs(this.width);
      this.x -= this.width;
    }
    if (this.height < 0) {
      this.height = Math.abs(this.height);
      this.y -= this.height;
    }
  }

  getLocalPosition(x: number, y: number): { x: number; y: number } {
    // Get Position based on top left
    x = x - this.x;
    y = y - this.y;
    return { x, y };
  }

  toJson() {
    const { x, y, width, height, style } = this;
    return { x, y, width, height, style };
  }

  fromJson(json: any): Element {
    return new RectangleElement(
      json.id,
      json.x,
      json.y,
      json.height,
      json.width
    );
  }

  getBounds() {
    return {
      left: this.x,
      top: this.y,
      right: this.x + this.width,
      bottom: this.y + this.height,
    };
  }

  resizeFromAnchor(ax: number, ay: number, mx: number, my: number): void {
    this.x = ax;
    this.y = ay;
    this.width = mx - ax;
    this.height = my - ay;
  }
}
