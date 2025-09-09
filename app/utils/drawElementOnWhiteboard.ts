import { store } from "~/store/store";
import type { BaseCoordinate, Coordinate2D } from "~/types";
import { getActiveElementIndex } from "./getActiveElementIndex";
import { getActivePageElements } from "./getActivePageElements";
import { isShapeElement } from "./isShapeElement";
import { UpdateElement } from "./updateElement";

export function drawElementOnWhiteboard({
  x1,
  y1,
  x2,
  y2,
}: Partial<Coordinate2D>) {
  const selectedElement = store.getState().editor.selectedElement;
  const activeElementIndex = getActiveElementIndex();
  const elements = getActivePageElements();
  if (!selectedElement) return;
  if (activeElementIndex !== -1) {
    const element = elements[activeElementIndex];
    if (isShapeElement(element)) {
      UpdateElement.new(elements).update({
        ...element,
        x1: x1 || element.x1,
        y1: y1 || element.y1,
        x2: x2 || element.x2,
        y2: y2 || element.y2,
        index: activeElementIndex,
      });
    }
  }
}
