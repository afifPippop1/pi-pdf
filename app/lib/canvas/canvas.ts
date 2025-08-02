import type { Drawable } from "../shape";
import { Rectangle } from "../shape";

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
  }

  private drawRect(element: Rectangle) {
    this.ctx.fillStyle = "#ffffff";

    // Draw filled rectangle (x, y, width, height)
    this.ctx.fillRect(element.x1, element.y1, element.width, element.height);

    // Set stroke color and line width (optional)
    // this.ctx.strokeStyle = "red";
    // this.ctx.lineWidth = 4;

    // Draw rectangle outline (x, y, width, height)
    // this.ctx.strokeRect(element.x1, element.y1, element.width, element.height);
    // this.ctx.strokeRect(50, 50, 150, 100);
  }
}

export const canvas = (c: HTMLCanvasElement | null | undefined) => {
  if (!c) throw Error("No canvas found");
  return new Canvas(c);
};
