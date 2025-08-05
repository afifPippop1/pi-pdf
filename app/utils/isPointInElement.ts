import type { Element } from "~/types";

export function isPointInElement(
  x: number,
  y: number,
  element: Element,
  scale: number
) {
  const minX = Math.min(element.x1, element.x2) * scale;
  const maxX = Math.max(element.x1, element.x2) * scale;
  const minY = Math.min(element.y1, element.y2) * scale;
  const maxY = Math.max(element.y1, element.y2) * scale;

  return x >= minX && x <= maxX && y >= minY && y <= maxY;
}
