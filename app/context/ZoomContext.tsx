import {
  createContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { PDFViewer } from "~/constants";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setZoom as setZoomSlice } from "~/store/slices/editorSlice";

interface ZoomContextType {
  zoom: number;
  setZoom: (_: (zoom: number) => number) => void;
}

const ZoomContext = createContext<ZoomContextType>({
  zoom: PDFViewer.SCALE,
  setZoom: () => {},
});

const WHEEL_EVENT = "wheel";

export function ZoomProvider({ children }: { children: ReactNode }) {
  const zoom = useAppSelector((s) => s.editor.zoom);
  const dispatch = useAppDispatch();

  function setZoom(cb: (zoom: number) => number) {
    dispatch(setZoomSlice(cb));
  }

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
    <ZoomContext.Provider value={{ zoom, setZoom }}>
      {children}
    </ZoomContext.Provider>
  );
}

export default ZoomContext;
