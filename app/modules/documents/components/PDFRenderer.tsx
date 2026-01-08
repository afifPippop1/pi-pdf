import type { PDFDocumentLoadingTask, RenderTask } from "pdfjs-dist";
import { useEffect, useRef } from "react";
import { useEditorStore } from "~/store/editorStore";
import { usePdfStore } from "~/store/pdfStore";
import { getPageFromIndex } from "~/utils";

export default function PDFRenderer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<RenderTask>(null);
  const loadingTask = usePdfStore((s) => s.loadingTask);
  const activeIndex = useEditorStore((s) => s.activePageIndex);
  const zoomLevel = useEditorStore((s) => s.zoomLevel);

  useEffect(() => {
    if (!loadingTask) return;
    loadingTask.promise.then((pdf) => {
      pdf.getPage(getPageFromIndex(activeIndex)).then((page) => {
        const viewport = page.getViewport({ scale: zoomLevel });
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
  }, [loadingTask, activeIndex, zoomLevel]);

  return <canvas ref={canvasRef} className="origin-center" />;
}
