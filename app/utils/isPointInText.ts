import { toolTypes } from "~/constants";
import type { BaseCoordinate, Element, TextElement } from "../types";

export function isPointInText(
  element: Element,
  coordinate: BaseCoordinate,
  ctx: CanvasRenderingContext2D
) {
  if (element.type !== toolTypes.TEXT) return false;
  const { x, y } = coordinate;
  ctx.font = `${element.properties.fontSize}px ${element.properties.fontFamily}, sans-serif`;
  const lines = element.text.split(/\r?\n/);
  let maxWidth = 0;
  for (const line of lines) {
    const lineWidth = ctx.measureText(line).width;
    if (lineWidth > maxWidth) {
      maxWidth = lineWidth;
    }
  }
  const metrics = ctx.measureText(lines[0]);
  const ascent = metrics.actualBoundingBoxAscent;
  const descent = metrics.actualBoundingBoxDescent;
  const lineHeight = (ascent !== undefined && descent !== undefined) ? (ascent + descent) * 1.2 : element.properties.fontSize * 1.2;
  const blockHeight = lineHeight * lines.length;
  const x2 = element.x1 + maxWidth;
  const y2 = element.y1 + blockHeight;
  return (
    x >= element.x1 &&
    x <= x2 &&
    y >= element.y1 &&
    y <= y2
  );
}
