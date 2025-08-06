import { useEffect, useState } from "react";
import { PDFViewer } from "~/constants";

export function useZoom({ onChange }: { onChange?: () => void } = {}) {
  const [zoom, setZoom] = useState<number>(PDFViewer.SCALE);

  useEffect(() => {
    function handleWheel(event: WheelEvent) {
      if (event.ctrlKey) {
        event.preventDefault();
        const zoomDelta = -event.deltaY * 0.001;
        setZoom((prevZoom) =>
          Math.min(
            Math.max(prevZoom + zoomDelta, PDFViewer.MIN_SCALE),
            PDFViewer.MAX_SCALE
          )
        );
        onChange?.();
      }
    }

    const document = window.document;
    if (document)
      document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      if (document) document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return { zoom };
}
