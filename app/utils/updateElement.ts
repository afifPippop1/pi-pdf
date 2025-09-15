import { setActivePageElements } from "~/store/slices/editorSlice";
import { store } from "~/store/store";
import type {
  Color,
  Element,
  LineElement,
  RectangleElement,
  RectangleProperties,
  TextElement,
} from "~/types";
import { CreateElement } from "./createElement";

interface RectangleElementProps
  extends Omit<Element<RectangleElement>, "element"> {
  index: number;
  options?: RectangleProperties;
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

export class UpdateElement {
  private elements: Element[];
  constructor(elements: Element[]) {
    this.elements = [...elements];
  }

  rectangle(element: RectangleElementProps) {
    const stateOptions = store.getState().editor.toolState.RECTANGLE;
    const { id, type, x1, x2, y1, y2, options } = element;
    const optCopy = options ? { ...options } : stateOptions;
    const updateElement = CreateElement.rectangle({
      id,
      type,
      x1,
      x2,
      y1,
      y2,
      options: optCopy,
    });

    this.elements[element.index] = updateElement;

    this.dispatch();
  }

  line(element: LineElementProps) {
    const { id, type, x1, x2, y1, y2 } = element;
    const updateElement = CreateElement.line({
      id,
      type,
      x1,
      x2,
      y1,
      y2,
    });

    this.elements[element.index] = updateElement;

    this.dispatch();
  }

  text(element: TextElementProps) {
    const { id, type, x1, y1, text, properties } = element;

    const updateElement = CreateElement.text({
      id,
      type,
      x1,
      y1,
      text,
      properties,
    });
    this.elements[element.index] = updateElement;

    this.dispatch();
  }

  private dispatch() {
    store.dispatch(setActivePageElements(this.elements));
  }

  update(element: UpdateElementProps) {
    switch (element.type) {
      case "RECTANGLE":
        return this.rectangle(element);
      case "LINE":
        return this.line(element);
      case "TEXT":
        return this.text(element);
      default:
        throw new Error("Something went wrong when updating element");
    }
  }

  static new(elements: Element[]) {
    return new UpdateElement(elements);
  }
}
