import { toolTypes } from "~/constants";
import type { BaseCoordinate, Element, TextElement } from "../types";
import { computeTextDimensions } from "./computeTextDimensions";

export function isPointInText(
  element: Element,
  coordinate: BaseCoordinate,
  ctx: CanvasRenderingContext2D
) {
  if (element.type !== toolTypes.TEXT) return false;
  const { x, y } = coordinate;
  ctx.font = `${element.properties.fontSize}px ${element.properties.fontFamily}, sans-serif`;
  const { width, height } = computeTextDimensions({ element, ctx });
  const x2 = element.x1 + width;
  const y2 = element.y1 + height;
  return x >= element.x1 && x <= x2 && y >= element.y1 && y <= y2;
}
