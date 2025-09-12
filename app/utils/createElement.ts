import { toolTypes } from "~/constants";
import { shapeGenerator } from "~/lib/shape";
import type { Color } from "~/types";
import type { Element, TextProperties } from "~/types";

const generator = shapeGenerator();

type RectangleProps = {
  type: typeof toolTypes.RECTANGLE;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  id: string;
  options?: {
    color?: Partial<Color>;
  };
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
  properties: TextProperties;
};

function generateRectangle({
  x1,
  x2,
  y1,
  y2,
  options,
}: Omit<RectangleProps, "id" | "type">) {
  return generator.rectangle(x1, y1, x2 - x1, y2 - y1, options);
}

function generateLine({ x1, x2, y1, y2 }: Omit<LineProps, "id" | "type">) {
  return generator.line(x1, y1, x2, y2);
}

export class CreateElement {
  static rectangle(props: RectangleProps): Element {
    const { x1, x2, y1, y2, type, id, options } = props;
    const element = generateRectangle({ x1, x2, y1, y2, options });
    return { id, element, type, x1, y1, x2, y2 };
  }
  static line(props: LineProps): Element {
    const { x1, x2, y1, y2, type, id } = props;
    const element = generateLine({ x1, x2, y1, y2 });
    return { id, element, type, x1, y1, x2, y2 };
  }
  static text(props: TextProps): Element {
    const { id, type, x1, y1, text, properties } = props;
    return { id, type, x1, y1, text, properties };
  }
}
