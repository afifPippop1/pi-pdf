import { toolTypes } from "~/constants";
import { setActivePageElements } from "~/store/slices/editorSlice";
import { store } from "~/store/store";
import type { Element } from "~/types";
import { createElement } from "./createElement";

type UpdateElementProps = Pick<
  Element,
  "id" | "type" | "x1" | "x2" | "y1" | "y2"
> & {
  index: number;
};

export function updateElement(
  { id, index, type, x1, x2, y1, y2 }: UpdateElementProps,
  elements: Element[]
) {
  const elementsCopy = [...elements];
  switch (type) {
    // case toolTypes.LINE:
    case toolTypes.RECTANGLE: {
      const updateElement = createElement({ id, type, x1, x2, y1, y2 });

      elementsCopy[index] = updateElement;

      store.dispatch(setActivePageElements(elementsCopy));
      break;
    }
    default:
      throw new Error("Something went wrong when updating element");
  }
}
