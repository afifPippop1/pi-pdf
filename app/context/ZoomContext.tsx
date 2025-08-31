import { createContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { PDFViewer } from "~/constants";

interface ZoomContextType {
  zoom: number;
  setZoom: Dispatch<SetStateAction<number>>
}

const ZoomContext = createContext<ZoomContextType>({
  zoom: PDFViewer.SCALE,
  setZoom() {},
});

const WHEEL_EVENT = "wheel";

export function ZoomProvider({ children }: { children: ReactNode }) {
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
      }
    }

    const document = window.document;
    if (document)
      document.addEventListener(WHEEL_EVENT, handleWheel, { passive: false });

    return () => {
      if (document) document.removeEventListener(WHEEL_EVENT, handleWheel);
    };
  }, []);

  return (
    <ZoomContext.Provider value={{ zoom, setZoom }}>{children}</ZoomContext.Provider>
  );
}

export default ZoomContext;
