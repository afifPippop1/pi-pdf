import type { Bounds } from "../types/bounds.type";
import type { ResizeHandle } from "../types/interaction.type";

export function getAnchorFromHandle(
  bounds: Bounds,
  handle: ResizeHandle
): { x: number; y: number } {
  const { left, top, right, bottom } = bounds;

  switch (handle) {
    case "nw":
      return { x: right, y: bottom };
    case "ne":
      return { x: left, y: bottom };
    case "sw":
      return { x: right, y: top };
    case "se":
      return { x: left, y: top };
  }
}
