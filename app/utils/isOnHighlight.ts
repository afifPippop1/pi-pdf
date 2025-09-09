import type { BaseCoordinate, Element } from "~/types";
import { isShapeElement } from "./isShapeElement";

const defaultValue = {
  on: false,
  onLeft: false,
  onRight: false,
  onTop: false,
  onBottom: false,
  onTopRight: false,
  onBottomRight: false,
  onBottomLeft: false,
  onTopLeft: false,
};

export function isOnHighlight({
  element,
  coordinate,
}: {
  element: Element;
  coordinate: BaseCoordinate;
}) {
  if (!isShapeElement(element)) return defaultValue;
  const tolerance = 3;
  const onLeft =
    Math.abs(coordinate.x - element.x1) <= tolerance &&
    coordinate.y >= element.y1 &&
    coordinate.y <= element.y2;

  const onRight =
    Math.abs(coordinate.x - element.x2) <= tolerance &&
    coordinate.y >= element.y1 &&
    coordinate.y <= element.y2;

  const onTop =
    Math.abs(coordinate.y - element.y1) <= tolerance &&
    coordinate.x >= element.x1 &&
    coordinate.x <= element.x2;

  const onBottom =
    Math.abs(coordinate.y - element.y2) <= tolerance &&
    coordinate.x >= element.x1 &&
    coordinate.x <= element.x2;

  return {
    on: onLeft || onRight || onTop || onBottom,
    onLeft,
    onRight,
    onTop,
    onBottom,
    onTopRight: onRight && onTop,
    onBottomRight: onRight && onBottom,
    onBottomLeft: onLeft && onBottom,
    onTopLeft: onLeft && onTop,
  };
}
