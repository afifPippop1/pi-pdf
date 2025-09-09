import { store } from "~/store/store";
import { getActiveElementIndex } from "./getActiveElementIndex";
import { isShapeElement } from "./isShapeElement";
import { getActivePageElements } from "./getActivePageElements";
import { UpdateElement } from "./updateElement";

export function drawElementOnWhiteboard({ x, y }: { x: number; y: number }) {
  const selectedElement = store.getState().editor.selectedElement;
  const activeElementIndex = getActiveElementIndex();
  const elements = getActivePageElements();
  if (!selectedElement) return;
  if (activeElementIndex !== -1) {
    const element = elements[activeElementIndex];
    if (isShapeElement(element)) {
      UpdateElement.new(elements).update({
        ...element,
        x2: x,
        y2: y,
        index: activeElementIndex,
      });
    }
  }
}
