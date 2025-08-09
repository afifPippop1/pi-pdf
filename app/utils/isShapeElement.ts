import type { Element } from "~/types";

export function isShapeElement(element: Element) {
  return "element" in element;
}
