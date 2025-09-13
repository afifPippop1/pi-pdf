import { ComponentHighlighter } from "~/lib/highlight";
import { store } from "~/store/store";
import type { BaseCoordinate } from "~/types";
import { isPointInElement } from "./isPointInElement";
import { isPointInText } from "./isPointInText";

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
  const context = canvas.getContext("2d")!;
  const isHovering =
    isPointInElement({ coordinate, element, scale: zoom }) ||
    isPointInText(element, coordinate, context);
  canvas.style.cursor = isHovering ? "move" : "default";

  const onHighlight = ComponentHighlighter.new(context, element).isOnHighlight(
    coordinate
  );
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
