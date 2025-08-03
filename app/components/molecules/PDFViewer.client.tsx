import * as pdfjsLib from "pdfjs-dist";
import { useEffect, useRef } from "react";
import { PDFViewer } from "~/constants";
import { getPageFromIndex } from "~/utils";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfViewerProps {
  pdfData: Uint8Array;
  pageIndex?: number;
}

export function PdfViewer({ pdfData, pageIndex = 0 }: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

  useEffect(() => {
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfData) });

    loadingTask.promise.then((pdf) => {
      pdf.getPage(getPageFromIndex(pageIndex)).then((page) => {
        const viewport = page.getViewport({ scale: PDFViewer.SCALE });
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
  }, [pdfData, pageIndex]);

  return <canvas ref={canvasRef} />;
}
