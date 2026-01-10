import { Tool } from "../constant/tooltype";
import type { Element } from "../models/Element";
import { EllipseElement } from "../models/Ellipse";
import { LineElement } from "../models/Line";
import { RectangleElement } from "../models/Rectangle";
import type { ToolType } from "../types/tooltype";
import { v4 as uuid } from "uuid";

export function createElement(
  tool: ToolType,
  x: number,
  y: number
): Element | null {
  if (tool === Tool.LINE) {
    const element = new LineElement(uuid(), x, y, x, y);
    return element;
  } else if (tool === Tool.RECTANGLE) {
    const element = new RectangleElement(uuid(), x, y, 0, 0);
    return element;
  } else if (tool === Tool.ELLIPSE) {
    const element = new EllipseElement(uuid(), x, y, x, y);
    return element;
  }
  return null;
}
