import { toolTypes } from "~/constants";
import { shapeGenerator } from "~/lib/shape";
import type {
  Element,
  ElementType,
  LineElement,
  RectangleElement,
} from "~/types";

const generator = shapeGenerator();

type RectangleProps = {
  type: typeof toolTypes.RECTANGLE;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  id: string;
};
type LineProps = {
  type: typeof toolTypes.LINE;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  id: string;
};
type TextProps = {
  type: typeof toolTypes.TEXT;
  x1: number;
  y1: number;
  id: string;
  text: string;
};

type CreateElementProps = RectangleProps | LineProps | TextProps;

// type CreateElementProps<T extends ElementType> = Omit<Element<T>, "element">;

function generateRectangle({
  x1,
  x2,
  y1,
  y2,
}: Omit<RectangleProps, "id" | "type">) {
  return generator.rectangle(x1, y1, x2 - x1, y2 - y1);
}

function generateLine({ x1, x2, y1, y2 }: Omit<LineProps, "id" | "type">) {
  return generator.line(x1, y1, x2, y2);
}

export function createElement(props: CreateElementProps): Element {
  if (props.type === toolTypes.RECTANGLE) {
    const { x1, x2, y1, y2, type, id } = props;
    const element = generateRectangle({ x1, x2, y1, y2 });
    return {
      id,
      element,
      type,
      x1,
      y1,
      x2: x2 || x1,
      y2: y2 || y1,
    };
  } else if (props.type === toolTypes.LINE) {
    const { x1, x2, y1, y2, type, id } = props;
    const element = generateLine({ x1, x2, y1, y2 });
    return {
      id,
      element,
      type,
      x1,
      y1,
      x2: x2 || x1,
      y2: y2 || y1,
    };
  }
  if (props.type === toolTypes.TEXT) {
    return {
      id: props.id,
      type: toolTypes.TEXT,
      x1: props.x1,
      y1: props.y1,
      text: props.text,
    };
  } else {
    throw new Error("Something went wrong when creating element");
  }
}
