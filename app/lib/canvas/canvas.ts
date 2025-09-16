import { getDashValue, rgbToString } from "~/utils";
import type { Drawable } from "../shape";
import { Line, Rectangle } from "../shape";
import { DEFAULT_LINE_WIDTH, strokeStyle } from "~/constants";

export class Canvas {
  constructor(private canvas: HTMLCanvasElement) {}

  get ctx() {
    const c = this.canvas.getContext("2d");
    if (!c) throw Error("Could not find any context on this canvas");
    return c;
  }

  draw(element: Drawable) {
    if (element instanceof Rectangle) {
      return this.drawRect(element);
    }
    if (element instanceof Line) {
      return this.drawLine(element);
    }
  }

  private drawLine(element: Line) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(element.x1, element.y1);

    this.ctx.lineTo(element.x2, element.y2);

    this.ctx.lineWidth = element.options.strokeWidth || DEFAULT_LINE_WIDTH;
    this.ctx.strokeStyle = rgbToString(element.options.color);

    const dash = getDashValue(element.options.strokeStyle);

    if (dash) {
      this.ctx.setLineDash(dash);
    }

    this.ctx.stroke();
    this.ctx.restore();
  }

  private drawRect(element: Rectangle) {
    this.ctx.save();
    this.ctx.lineWidth = element.options.strokeWidth || DEFAULT_LINE_WIDTH;
    this.ctx.strokeStyle = rgbToString(element.options.outlineColor);
    this.ctx.fillStyle = rgbToString(element.options.color);
    const dash = getDashValue(element.options.strokeStyle);

    if (dash) {
      this.ctx.setLineDash(dash);
    }

    this.ctx.strokeRect(element.x, element.y, element.width, element.height);
    this.ctx.fillRect(element.x, element.y, element.width, element.height);
    this.ctx.restore();
  }
}

export const createCanvas = (c: HTMLCanvasElement | null | undefined) => {
  if (!c) throw Error("No canvas found");
  return new Canvas(c);
};
