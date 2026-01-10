import type { Bounds } from "../types/bounds.type";
import type { ResizeHandle } from "../types/interaction.type";

export function getResizeHandles(
  bounds: Bounds,
  padding: number = 8
): Record<ResizeHandle, { x: number; y: number }> {
  const { left, top, right, bottom } = bounds;

  const x1 = left - padding;
  const y1 = top - padding;
  const x2 = right + padding;
  const y2 = bottom + padding;

  return {
    nw: { x: x1, y: y1 },
    ne: { x: x2, y: y1 },
    sw: { x: x1, y: y2 },
    se: { x: x2, y: y2 },
  };
}
