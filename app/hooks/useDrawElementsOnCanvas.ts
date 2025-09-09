import { useLayoutEffect } from "react";
import { createCanvas } from "~/lib/canvas";
import type { Action } from "~/types/action";
import { drawElementOnCanvas } from "~/utils";

export function useDrawElementsOnCanvas({
  ref,
  action,
  docSize,
  zoom,
}: {
  ref: React.RefObject<HTMLCanvasElement | null>;
  action: Action | null;
  docSize: { width: number; height: number };
  zoom: number;
}) {
  useLayoutEffect(() => {
    const canvasElement = ref.current;
    const canvas = createCanvas(canvasElement);

    if (canvasElement) {
      drawElementOnCanvas(canvasElement, canvas, action, docSize, zoom);
    }
  }, [action, zoom, docSize]);
}
