import type { Element } from "~/types";
import { toolTypes } from "../constants";
import type { Canvas } from "~/lib/canvas";

type DrawElementProps = {
  canvas: Canvas;
  context: CanvasRenderingContext2D | null;
  element: Element;
};

export function drawElement({ element, canvas }: DrawElementProps) {
  switch (element.type) {
    case toolTypes.LINE:
    case toolTypes.RECTANGLE:
      canvas.draw(element.element);
      return;
    default:
      throw new Error("Something went wrong when drawing element");
  }
}
