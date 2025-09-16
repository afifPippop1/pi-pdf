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
  const texts = element.text.split("\n");
  ctx.textBaseline = "top";
  ctx.font = `${element.properties.fontSize}px ${element.properties.fontFamily}, sans-serif`;
  ctx.fillStyle = "black";
  let yOffset = 0;
  texts.forEach((text) => {
    const metrics = ctx.measureText(element.text);
    const lineHeight =
      metrics.actualBoundingBoxAscent && metrics.actualBoundingBoxDescent
        ? (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) *
          1.2
        : element.properties.fontSize * 1.2;
    ctx.fillText(
      text,
      Math.round(element.x1),
      Math.round(element.y1 + yOffset)
    );
    yOffset += lineHeight;
  });
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
