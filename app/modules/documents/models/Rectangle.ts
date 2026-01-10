import type { Color, StrokeStyle } from "~/types";
import { Shape } from "../constant/shape";
import { Element } from "./Element";
import { DEFAULT_LINE_WIDTH } from "~/constants";
import { getDashValue, rgbToString } from "~/utils";

class RectangleStyle {
  public color: Color;
  public outlineColor: Color;
  public strokeWidth: number;
  public strokeStyle: StrokeStyle;

  constructor({
    color,
    outlineColor,
    strokeWidth,
    strokeStyle,
  }: {
    color: Color;
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
    color: { r: 0, g: 0, b: 0, a: 1 },
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
    ctx.fillStyle = rgbToString(this.style.color);
    const dash = getDashValue(this.style.strokeStyle);

    if (dash) {
      ctx.setLineDash(dash);
    }

    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}
