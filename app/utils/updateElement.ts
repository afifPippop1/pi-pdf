import { toolTypes } from "~/constants";
import type { Color } from "~/lib/shape/rectangle";
import { setActivePageElements } from "~/store/slices/editorSlice";
import { store } from "~/store/store";
import type {
  Element,
  LineElement,
  RectangleElement,
  TextElement,
} from "~/types";
import { createElement } from "./createElement";

interface RectangleElementProps
  extends Omit<Element<RectangleElement>, "element"> {
  index: number;
  options?: {
    color?: Partial<Color>;
  };
}

interface LineElementProps extends Omit<Element<LineElement>, "element"> {
  index: number;
}

interface TextElementProps extends Element<TextElement> {
  index: number;
}

type UpdateElementProps =
  | RectangleElementProps
  | LineElementProps
  | TextElementProps;

export function updateElement(
  element: UpdateElementProps,
  elements: Element[]
) {
  const elementsCopy = [...elements];
  switch (element.type) {
    case toolTypes.LINE:
      const { id, type, x1, x2, y1, y2 } = element;
      const updateElement = createElement({
        id,
        type,
        x1,
        x2,
        y1,
        y2,
      });

      elementsCopy[element.index] = updateElement;

      store.dispatch(setActivePageElements(elementsCopy));
      break;
    case toolTypes.RECTANGLE: {
      const stateOptions = store.getState().editor.toolState.RECTANGLE;
      const { id, type, x1, x2, y1, y2, options } = element;
      const updateElement = createElement({
        id,
        type,
        x1,
        x2,
        y1,
        y2,
        options: options || stateOptions,
      });

      elementsCopy[element.index] = updateElement;

      store.dispatch(setActivePageElements(elementsCopy));
      break;
    }
    case toolTypes.TEXT: {
      const { id, type, x1, y1, text } = element;

      const updateElement = createElement({ id, type, x1, y1, text });
      elementsCopy[element.index] = updateElement;
      store.dispatch(setActivePageElements(elementsCopy));
      break;
    }
    default:
      throw new Error("Something went wrong when updating element");
  }
}
