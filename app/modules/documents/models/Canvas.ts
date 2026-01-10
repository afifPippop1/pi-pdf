import { Element } from "./Element";

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
    });

    this.ctx.restore();
  }
}
