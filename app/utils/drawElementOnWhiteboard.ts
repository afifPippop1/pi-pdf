import { store } from "~/store/store";
import type { BaseCoordinate, Coordinate2D } from "~/types";
import { getActiveElementIndex } from "./getActiveElementIndex";
import { getActivePageElements } from "./getActivePageElements";
import { isShapeElement } from "./isShapeElement";
import { UpdateElement } from "./updateElement";
import { toolTypes } from "~/constants";

export function drawElementOnWhiteboard({
  x1,
  y1,
  x2,
  y2,
}: Partial<Coordinate2D>) {
  const activeElementIndex = getActiveElementIndex();
  const elements = getActivePageElements();
  if (activeElementIndex === -1) return;
  const element = elements[activeElementIndex];
  if (element.type === toolTypes.RECTANGLE) {
    UpdateElement.new(elements).rectangle({
      ...element,
      x1: x1 || element.x1,
      y1: y1 || element.y1,
      x2: x2 || element.x2,
      y2: y2 || element.y2,
      index: activeElementIndex,
      options: element.element.options,
    });
  } else if (element.type === toolTypes.LINE) {
    UpdateElement.new(elements).line({
      ...element,
      x1: x1 || element.x1,
      y1: y1 || element.y1,
      x2: x2 || element.x2,
      y2: y2 || element.y2,
      index: activeElementIndex,
      options: element.element.options,
    });
  }
}
