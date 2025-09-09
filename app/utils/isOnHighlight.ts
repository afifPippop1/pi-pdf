import { toolTypes } from "~/constants";
import type {
  BaseCoordinate,
  Coordinate2D,
  Element,
  ElementType,
  LineElement,
  RectangleElement,
  TextElement,
} from "~/types";
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

interface ITextElement {
  element: Element<TextElement>;
  context: CanvasRenderingContext2D;
}

type IsOnHighlightProps = {
  coordinate: BaseCoordinate;
  element: Element;
  context: CanvasRenderingContext2D | null;
};

export function isOnHighlight(props: IsOnHighlightProps) {
  const { coordinate, element } = props;
  if (isShapeElement(element)) {
    return isOn({ coordinate, elementCoordinate: element });
  } else if (element.type === toolTypes.TEXT && props.context) {
    const width = props.context?.measureText(element.text).width;
    const height = element.properties.fontSize;
    const x2 = element.x1 + width;
    const y2 = element.y1 + height;
    const elementCoordinate = {
      x1: element.x1,
      x2,
      y1: element.y1,
      y2,
    };
    return isOn({ coordinate, elementCoordinate });
  }
  return defaultValue;
}

function isOn({
  coordinate,
  elementCoordinate,
}: {
  coordinate: BaseCoordinate;
  elementCoordinate: Coordinate2D;
}) {
  const tolerance = 5;
  const onLeft =
    Math.abs(coordinate.x - elementCoordinate.x1) <= tolerance &&
    coordinate.y >= elementCoordinate.y1 &&
    coordinate.y <= elementCoordinate.y2;

  const onRight =
    Math.abs(coordinate.x - elementCoordinate.x2) <= tolerance &&
    coordinate.y >= elementCoordinate.y1 &&
    coordinate.y <= elementCoordinate.y2;

  const onTop =
    Math.abs(coordinate.y - elementCoordinate.y1) <= tolerance &&
    coordinate.x >= elementCoordinate.x1 &&
    coordinate.x <= elementCoordinate.x2;

  const onBottom =
    Math.abs(coordinate.y - elementCoordinate.y2) <= tolerance &&
    coordinate.x >= elementCoordinate.x1 &&
    coordinate.x <= elementCoordinate.x2;

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
