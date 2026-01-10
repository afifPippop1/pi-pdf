import { actions } from "~/constants";
import type { Canvas } from "~/lib/canvas";
import { ComponentHighlighter } from "~/lib/highlight";
import type { Element } from "~/types";
import type { Action } from "~/types/action";
import { drawElement } from "~/utils";

export function drawElementOnCanvas(
  canvasElement: HTMLCanvasElement,
  canvas: Canvas,
  action: Action | null,
  docSize: { width: number; height: number },
  scale: number,
  elements: Element[] | null
) {
  const ctx = canvasElement.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;

  // Scale up backing store
  canvasElement.width = docSize.width * dpr;
  canvasElement.height = docSize.height * dpr;
  canvasElement.style.width = `${docSize.width}px`;
  canvasElement.style.height = `${docSize.height}px`;

  ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  ctx.save();
  ctx.scale(dpr * scale, dpr * scale);

  elements?.forEach((element) => {
    if (action === actions.WRITING && element.id === selectedElement?.id) {
      return;
    }
    drawElement({ canvas, context: ctx, element });

    if (element.id === selectedElement?.id && action !== actions.DRAWING) {
      ComponentHighlighter.new(ctx, element).drawHighlight();
    }
  });

  ctx.restore();
}
