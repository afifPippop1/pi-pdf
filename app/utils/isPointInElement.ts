import type { Element } from "~/types";
import { isShapeElement } from "./isShapeElement";

export function isPointInElement({
  coordinate: { x, y },
  element,
  scale,
}: {
  coordinate: { x: number; y: number };
  element: Element;
  scale: number;
}) {
  if (isShapeElement(element)) {
    const minX = Math.min(element.x1, element.x2);
    const maxX = Math.max(element.x1, element.x2);
    const minY = Math.min(element.y1, element.y2);
    const maxY = Math.max(element.y1, element.y2);

    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  }
  return false;
}
