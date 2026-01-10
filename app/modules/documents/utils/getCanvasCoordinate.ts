import type { MouseEvent } from "react";
import { normalizeCoordinate } from "~/utils";

export function getCanvasCoordinate(e: MouseEvent<HTMLCanvasElement>, zoomLevel: number) {
  const canvas = e.currentTarget;
  const rect = canvas.getBoundingClientRect();

  return normalizeCoordinate({
    x: e.clientX,
    y: e.clientY,
    bounding: rect,
    zoom: zoomLevel,
  });
}
