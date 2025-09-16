import { toolTypes } from "~/constants";
import { store } from "~/store/store";
import type { BaseCoordinate } from "~/types";
import { getActivePageElements } from "./getActivePageElements";
import { UpdateElement } from "./updateElement";

export function draggingElementOnWhiteboard({
  coordinate: { x, y },
  dragOffset,
}: {
  coordinate: BaseCoordinate;
  dragOffset: BaseCoordinate;
}) {
  const selectedElement = store.getState().editor.selectedElement;
  const elements = getActivePageElements();

  if (!selectedElement) return;
  const index = elements.findIndex((el) => el.id === selectedElement.id);
  if (index === -1) return;

  const element = elements[index];
  const updateElement = UpdateElement.new(elements);
  if (element.type === toolTypes.LINE || element.type === toolTypes.RECTANGLE) {
    const width = element.x2 - element.x1;
    const height = element.y2 - element.y1;

    const newX1 = x - dragOffset.x;
    const newY1 = y - dragOffset.y;
    const newX2 = newX1 + width;
    const newY2 = newY1 + height;

    if (element.type === toolTypes.RECTANGLE) {
      updateElement.rectangle({
        ...element,
        x1: newX1,
        y1: newY1,
        x2: newX2,
        y2: newY2,
        index,
        options: element.element.options,
      });
    } else {
      updateElement.line({
        ...element,
        x1: newX1,
        y1: newY1,
        x2: newX2,
        y2: newY2,
        index,
        options: element.element.options,
      });
    }
  } else if (element.type === toolTypes.TEXT) {
    const newX1 = x - dragOffset.x;
    const newY1 = y - dragOffset.y;
    updateElement.text({
      ...element,
      type: toolTypes.TEXT,
      x1: newX1,
      y1: newY1,
      index,
    });
  }
}
