import { useEffect, useRef } from "react";
import { useEditorStore } from "~/store/editorStore";
import { usePdfStore } from "~/store/pdfStore";
import { getPageFromIndex } from "~/utils";
import { PDFPageRenderer } from "./PDFPageRenderer";

export default function PDFRenderer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<PDFPageRenderer | null>(null);
  const loadingTask = usePdfStore((s) => s.loadingTask);
  const activeIndex = useEditorStore((s) => s.activePageIndex);
  const zoomLevel = useEditorStore((s) => s.zoomLevel);

  if (!rendererRef.current) {
    rendererRef.current = new PDFPageRenderer();
  }

  useEffect(() => {
    if (!loadingTask) return;

    loadingTask.promise.then((pdf) => {
      pdf.getPage(getPageFromIndex(activeIndex)).then((page) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        rendererRef.current?.render({
          page,
          canvas,
          scale: zoomLevel,
        });
      });
    });

    return () => {
      rendererRef.current?.cancel();
    };
  }, [loadingTask, activeIndex, zoomLevel]);

  return <canvas ref={canvasRef} className="origin-center" />;
}
