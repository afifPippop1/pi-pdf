import * as pdfjsLib from "pdfjs-dist";
import { useEffect, useRef } from "react";
import { getPageFromIndex } from "~/utils";

interface PdfViewerProps {
  pdfData: Uint8Array;
  pageIndex?: number;
  scale?: number;
  onPdfRendered: () => void;
}

export function PdfViewer({
  pdfData,
  pageIndex = 0,
  scale = 1,
  onPdfRendered,
}: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

  useEffect(() => {
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfData) });

    loadingTask.promise.then((pdf) => {
      pdf.getPage(getPageFromIndex(pageIndex)).then((page) => {
        const viewport = page.getViewport({ scale: scale });
        const pdfX1Y1 = viewport.convertToPdfPoint(0, 1);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d", { willReadFrequently: true });
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

        renderTask.promise
          .then(() => onPdfRendered())
          .catch((err) => {
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
  }, [pdfData, pageIndex, scale]);

  return <canvas ref={canvasRef} />;
}
