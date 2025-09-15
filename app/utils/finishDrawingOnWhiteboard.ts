import { toolTypes } from "~/constants";
import { adjustElementCoordinates } from "./adjustElementCoordinates";
import { adjustmentRequired } from "./adjustmentRequired";
import { getActiveElementIndex } from "./getActiveElementIndex";
import { getActivePageElements } from "./getActivePageElements";
import { isShapeElement } from "./isShapeElement";
import { UpdateElement } from "./updateElement";

export function finishDrawingOnWhiteboard() {
  const selectedElementIndex = getActiveElementIndex();
  const elements = getActivePageElements();
  const element = elements[selectedElementIndex];
  if (isShapeElement(element)) {
    if (adjustmentRequired(element.type)) {
      const coordinates = adjustElementCoordinates(element);
      if (coordinates) {
        const { x1, x2, y1, y2 } = coordinates;
        const updateElement = UpdateElement.new(elements);
        if (element.type === toolTypes.RECTANGLE) {
          updateElement.update({
            id: element.id,
            index: selectedElementIndex,
            type: element.type,
            x1,
            y1,
            x2,
            y2,
            options: element.element.options,
          });
        } else if (element.type === toolTypes.LINE) {
          updateElement.update({
            id: element.id,
            index: selectedElementIndex,
            type: element.type,
            x1,
            y1,
            x2,
            y2,
          });
        }
      }
    }
  }
}
