import { toolTypes } from "~/constants";
import { shapeGenerator, type Drawable } from "~/lib/shape";
import type { Coordinate2D, Element, ToolType } from "~/types";

const generator = shapeGenerator();

type CreateElementProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: ToolType;
  id: string;
  pdfCoordinate?: Coordinate2D;
};
function generateRectangle({
  x1,
  x2,
  y1,
  y2,
}: Pick<CreateElementProps, "x1" | "x2" | "y1" | "y2">) {
  return generator.rectangle(x1, y1, x2 - x1, y2 - y1);
}

function generateLine({
  x1,
  x2,
  y1,
  y2,
}: Pick<CreateElementProps, "x1" | "x2" | "y1" | "y2">) {
  return generator.line(x1, y1, x2, y2);
}

export function createElement({
  x1,
  x2,
  y1,
  y2,
  type,
  id,
  pdfCoordinate,
}: CreateElementProps): Element {
  let element: Drawable;
  switch (type) {
    case toolTypes.RECTANGLE:
      element = generateRectangle({ x1, x2, y1, y2 });
      break;
    case toolTypes.LINE:
      element = generateLine({ x1, x2, y1, y2 });
      break;
    default:
      throw new Error("Something went wrong when creating element");
  }

  return {
    id,
    element,
    type,
    x1,
    x2,
    y1,
    y2,
    pdfCoordinate: pdfCoordinate || {
      x1,
      x2,
      y1,
      y2,
    },
  };
}
