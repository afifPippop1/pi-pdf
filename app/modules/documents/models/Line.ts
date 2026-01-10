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
}
