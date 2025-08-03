import type { Element } from "~/types";

export function isPointInElement(x: number, y: number, element: Element) {
  const minX = Math.min(element.x1, element.x2);
  const maxX = Math.max(element.x1, element.x2);
  const minY = Math.min(element.y1, element.y2);
  const maxY = Math.max(element.y1, element.y2);

  return x >= minX && x <= maxX && y >= minY && y <= maxY;
}
