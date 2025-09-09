import type { BaseCoordinate } from "~/types";
import { drawElementOnWhiteboard } from "./drawElementOnWhiteboard";

export class ScaleElementOnWhiteboard {
  static topLeft({ x, y }: BaseCoordinate) {
    drawElementOnWhiteboard({ x1: x, y1: y });
  }
  static bottomRight({ x, y }: BaseCoordinate) {
    drawElementOnWhiteboard({ x2: x, y2: y });
  }
  static bottomLeft({ x, y }: BaseCoordinate) {
    drawElementOnWhiteboard({ x1: x, y2: y });
  }
  static topRight({ x, y }: BaseCoordinate) {
    drawElementOnWhiteboard({ x2: x, y1: y });
  }
  static top({ y }: BaseCoordinate) {
    drawElementOnWhiteboard({ y1: y });
  }
  static left({ x }: BaseCoordinate) {
    drawElementOnWhiteboard({ x1: x });
  }
  static right({ x }: BaseCoordinate) {
    drawElementOnWhiteboard({ x2: x });
  }
  static bottom({ y }: BaseCoordinate) {
    drawElementOnWhiteboard({ y2: y });
  }
}
