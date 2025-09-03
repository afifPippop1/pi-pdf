import * as pdfjsLib from "pdfjs-dist";
import { useEffect, useRef } from "react";
import { useZoom } from "~/hooks/useZoom";
import { useAppSelector } from "~/store/hooks";
import { getPageFromIndex } from "~/utils";

interface PdfViewerProps {
  pdfData: Uint8Array;
  pageIndex?: number;
}

export function PdfViewer({ pdfData, pageIndex = 0 }: PdfViewerProps) {
  const { zoom } = useZoom();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);
  const loadingTask = useAppSelector((s) => s.editor.loadingTask);
  const toolType = useAppSelector((s) => s.editor.toolType);
  const selectedElement = useAppSelector((s) => s.editor.selectedElement);

  useEffect(() => {
    if (!loadingTask) return;

    loadingTask.promise.then((pdf) => {
      pdf.getPage(getPageFromIndex(pageIndex)).then((page) => {
        const viewport = page.getViewport({ scale: zoom });
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);

        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        const transform =
          outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

        if (!transform) return;

        // Cancel any ongoing render before starting a new one
        renderTaskRef.current?.cancel();

        const renderTask = page.render({
          canvasContext: context!,
          viewport,
          canvas,
          transform,
        });

        renderTaskRef.current = renderTask;

        renderTask.promise.catch((err) => {
          if (err?.name !== "RenderingCancelledException") {
            console.error("Render error:", err);
          }
        });
      });
    });

    return () => {
      renderTaskRef.current?.cancel();
    };
  }, [pdfData, pageIndex, zoom, loadingTask]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        touchAction: toolType || selectedElement ? "none" : "auto",
      }}
    />
  );
}
