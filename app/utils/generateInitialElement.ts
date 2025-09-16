import { actions, toolTypes } from "~/constants";
import { store } from "~/store/store";
import type { BaseCoordinate, Element, TextProperties } from "~/types";
import type { Action } from "~/types/action";
import { CreateElement } from "./createElement";
import { v4 as uuid } from "uuid";
import { setSelectedElement, updateElement } from "~/store/slices/editorSlice";

export function generateInitialElement({
  canvas,
  coordinate: { x, y },
  setAction,
}: {
  canvas: HTMLCanvasElement;
  coordinate: BaseCoordinate;
  setAction: (action: Action | null) => void;
}) {
  const toolType = store.getState().editor.toolType;
  const toolState = store.getState().editor.toolState;
  let element: Element | null = null;

  if (toolType) {
    canvas.style.cursor = "default";

    if (toolType === toolTypes.TEXT) {
      setAction(actions.WRITING);
      element = CreateElement.text({
        x1: x,
        y1: y,
        text: "",
        type: toolType,
        id: uuid(),
        properties: toolState.TEXT as TextProperties,
      });
    } else if (toolType === toolTypes.LINE) {
      setAction(actions.DRAWING);
      element = CreateElement.line({
        x1: x,
        y1: y,
        x2: x,
        y2: y,
        type: toolType,
        id: uuid(),
        options: toolState.LINE,
      });
    } else if (toolType === toolTypes.RECTANGLE) {
      setAction(actions.DRAWING);
      element = CreateElement.rectangle({
        x1: x,
        y1: y,
        x2: x,
        y2: y,
        type: toolType,
        id: uuid(),
        options: toolState.RECTANGLE,
      });
    }

    if (!element) return;
    store.dispatch(setSelectedElement(element));
    store.dispatch(updateElement(element));
  }
}
