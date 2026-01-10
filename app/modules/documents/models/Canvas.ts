import { INTERACTION } from "../constant/interaction";
import type { Interaction } from "../types/interaction.type";
import { Element } from "./Element";

type RenderContext = {
  activeElement: Element | null;
  scale: number;
  dpr: number;
  interaction: Interaction;
};

export class Canvas {
  private ctx: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement) {
    const c = canvas.getContext("2d", { willReadFrequently: true });
    if (!c) throw Error("Could not find any context on this canvas");
    this.ctx = c;
  }

  draw(elements: Element[], ctx: RenderContext) {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    this.ctx.scale(ctx.dpr * ctx.scale, ctx.dpr * ctx.scale);

    elements?.forEach((element) => {
      element.draw(this.ctx);
      if (
        element.id === ctx.activeElement?.id &&
        ctx.interaction.type === INTERACTION.Dragging
      ) {
        element.drawHighlight(this.ctx);
      }
    });

    this.ctx.restore();
  }
}
