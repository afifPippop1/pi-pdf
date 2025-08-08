import type { Canvas } from "~/lib/canvas";
import type { Element, TextElement } from "~/types";
import { toolTypes } from "../constants";

type DrawElementProps = {
  canvas: Canvas;
  context: CanvasRenderingContext2D | null;
  element: Element;
};

function drawText(
  ctx: CanvasRenderingContext2D,
  element: Element<TextElement>
) {
  ctx.textBaseline = "top";
  ctx.font = "24px sans-serif";
  ctx.fillText(element.text, element.x1, element.y1);
}

export function drawElement({ element, canvas }: DrawElementProps) {
  switch (element.type) {
    case toolTypes.LINE:
    case toolTypes.RECTANGLE:
      canvas.draw(element.element);
      break;
    case toolTypes.TEXT:
      drawText(canvas.ctx, element);
      break;
    default:
      throw new Error("Something went wrong when drawing element");
  }
}
