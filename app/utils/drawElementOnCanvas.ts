import { actions } from "~/constants";
import type { Canvas } from "~/lib/canvas";
import { ComponentHighlighter } from "~/lib/highlight";
import { store } from "~/store/store";
import type { Action } from "~/types/action";
import { drawElement } from "./drawElement";

export function drawElementOnCanvas(
  canvasElement: HTMLCanvasElement,
  canvas: Canvas,
  action: Action | null,
  docSize: { width: number; height: number },
  scale: number
) {
  const ctx = canvasElement.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;

  const activePageIndex = store.getState().editor.activePageIndex;
  const elements = store.getState().editor.elements[activePageIndex];
  const selectedElement = store.getState().editor.selectedElement;

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
