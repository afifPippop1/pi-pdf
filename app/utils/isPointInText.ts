import type { BaseCoordinate, TextElement } from "../types";

export function isPointInText(
  element: TextElement,
  coordinate: BaseCoordinate,
  ctx: CanvasRenderingContext2D
) {
  const { x, y } = coordinate;
  ctx.font = `${element.properties.fontSize}px ${element.properties.fontFamily}, sans-serif`;
  const width = ctx.measureText(element.text).width;
  const height = element.properties.fontSize;
  return (
    x >= element.x1 &&
    x <= element.x1 + width &&
    y >= element.y1 &&
    y <= element.y1 + height
  );
}
