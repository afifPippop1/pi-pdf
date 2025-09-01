import { DEFAULT_FONT_SIZE } from "~/constants";
import type { TextElement } from "../types";


export function isPointInText(
  element: TextElement,
  x: number,
  y: number,
  ctx: CanvasRenderingContext2D
) {
  ctx.font = `${DEFAULT_FONT_SIZE}px Ubuntu, sans-serif`;
  const width = ctx.measureText(element.text).width;
  // const height = element.fontSize; // rough estimate
  const height = DEFAULT_FONT_SIZE; // rough estimate
  return (
    x >= element.x1 &&
    x <= element.x1 + width &&
    y >= element.y1 &&
    y <= element.y1 + height
  );
}
