import { DEFAULT_LINE_WIDTH } from "~/constants";
import { Element } from "./Element";
import { getDashValue, rgbToString } from "~/utils";
import type { LineElement } from "./Line";

export class Canvas {
  private ctx: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement) {
    const c = canvas.getContext("2d", { willReadFrequently: true });
    if (!c) throw Error("Could not find any context on this canvas");
    this.ctx = c;
  }

  draw(elements: Element[], scale: number, dpr: number = 1) {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    this.ctx.scale(dpr * scale, dpr * scale);

    elements?.forEach((element) => {
      element.draw(this.ctx);
      // if (element instanceof LineElement) {
      //   this.drawLine(element);
      // }
    });

    this.ctx.restore();
  }

  drawLine(element: LineElement) {
    this.ctx.beginPath();
    this.ctx.moveTo(element.x1, element.y1);
    this.ctx.lineTo(element.x2, element.y2);

    this.ctx.lineWidth = element.style.strokeWidth || DEFAULT_LINE_WIDTH;
    this.ctx.strokeStyle = rgbToString(element.style.color);

    const dash = getDashValue(element.style.strokeStyle);
    this.ctx.setLineDash(dash ?? []);

    this.ctx.stroke();
  }
}
