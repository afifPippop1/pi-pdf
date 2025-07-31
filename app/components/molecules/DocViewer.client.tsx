import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Set the worker manually
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

interface PdfViewerProps {
  pdfData: Uint8Array;
  page?: number;
}

export function PdfViewer({ pdfData, page = 1 }: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

  useEffect(() => {
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfData) });

    loadingTask.promise.then((pdf) => {
      pdf.getPage(page).then((page) => {
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Cancel any ongoing render before starting a new one
        renderTaskRef.current?.cancel();

        const renderTask = page.render({
          canvasContext: context!,
          viewport,
          canvas,
        });

        renderTaskRef.current = renderTask;

        renderTask.promise.catch((err) => {
          if (err?.name !== "RenderingCancelledException") {
            console.error("Render error:", err);
          }
        });
      });
    });

    // Optional: cancel render task if component unmounts
    return () => {
      renderTaskRef.current?.cancel();
    };
  }, [pdfData, page]);

  return <canvas ref={canvasRef} />;
}
