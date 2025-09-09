import type { BaseCoordinate } from "~/types";
import { isPointInElement } from "./isPointInElement";
import { store } from "~/store/store";
import { isOnHighlight } from "./isOnHighlight";

export function setCanvasCursor({
  canvas,
  coordinate,
  zoom,
}: {
  canvas: HTMLCanvasElement;
  coordinate: BaseCoordinate;
  zoom: number;
}) {
  const element = store.getState().editor.selectedElement;
  if (!element) return;
  const isHovering = isPointInElement({ coordinate, element, scale: zoom });
  canvas.style.cursor = isHovering ? "move" : "default";

  const onHighlight = isOnHighlight({ element, coordinate });
  if (onHighlight.on) {
    if (onHighlight.onTopRight || onHighlight.onBottomLeft) {
      canvas.style.cursor = "nesw-resize";
    } else if (onHighlight.onTopLeft || onHighlight.onBottomRight) {
      canvas.style.cursor = "nwse-resize";
    } else if (onHighlight.onTop || onHighlight.onBottom) {
      canvas.style.cursor = "ns-resize";
    } else if (onHighlight.onLeft || onHighlight.onRight) {
      canvas.style.cursor = "ew-resize";
    }
  }
}
