import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { PDFViewer } from "~/constants";
import { useDocBuffer } from "~/hooks/useDocBuffer";
import { useAppSelector } from "~/store/hooks";
import {
  setActivePageIndex,
  setElements,
  setPDFDoc,
} from "~/store/slices/editorSlice";
import { getPageFromIndex } from "~/utils";
import { Button } from "../atoms/Button";
import ContextMenu, { type Option } from "../molecules/ContextMenu";
import EmptyFile from "../molecules/EmptyFile";
import { Navbar } from "../molecules/Navbar";
import { PdfViewer } from "../molecules/PDFViewer.client";
import { ToolPicker } from "../molecules/ToolPicker";
import { Whiteboard } from "../molecules/Whiteboard";

export function EditorPage() {
  const { blob, setBlob } = useDocBuffer();
  const activePageIndex = useAppSelector((s) => s.editor.activePageIndex);
  const elements = useAppSelector((s) => s.editor.elements);
  const pdfDoc = useAppSelector((s) => s.editor.pdfDoc);
  const dispatch = useDispatch();
  const [zoom, setZoom] = useState<number>(PDFViewer.SCALE); // e.g., 1 = 100%
  const [pdfReady, setPdfReady] = useState(false);

  useEffect(() => {
    function handleWheel(event: WheelEvent) {
      if (event.ctrlKey) {
        event.preventDefault(); // Prevent browser zoom
        setPdfReady(false);
        const zoomDelta = -event.deltaY * 0.001;
        setZoom((prevZoom) => Math.min(Math.max(prevZoom + zoomDelta, 0.1), 3));
      }
    }

    const document = window.document;
    if (document)
      document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      if (document) document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-[#EDEDED] overflow-hidden flex flex-col">
      <Navbar />
      <div className="overflow-auto flex-1 flex-col items-stretch pt-8 relative">
        {!blob ? (
          <EmptyFile />
        ) : (
          <>
            <div className="flex gap-4">
              {pdfDoc?.getPageIndices().map((index) => {
                const options: Option[] = [
                  {
                    label: "Remove",
                    value: index,
                  },
                ];
                return (
                  <ContextMenu
                    key={index}
                    options={options}
                    onChange={async () => {
                      if (pdfDoc.getPageCount() === 1) {
                        dispatch(setPDFDoc(null));
                        setBlob(undefined);
                      } else {
                        if (activePageIndex === index) {
                          if (activePageIndex !== 0) {
                            dispatch(setActivePageIndex(index - 1));
                          }
                        }
                        pdfDoc.removePage(index);
                        const el = elements.filter((_, idx) => idx !== index);
                        dispatch(setElements(el));
                        const buffer = await pdfDoc.save();
                        setBlob(buffer);
                      }
                    }}
                  >
                    <Button
                      key={index}
                      onClick={() => dispatch(setActivePageIndex(index))}
                    >
                      {getPageFromIndex(index)}
                    </Button>
                  </ContextMenu>
                );
              })}
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <PdfViewer
                  pdfData={blob}
                  pageIndex={activePageIndex}
                  scale={zoom}
                  onPdfRendered={() => setPdfReady(true)}
                />
                <Whiteboard scale={zoom} readyToRender={pdfReady} />
              </div>
            </div>
            <ToolPicker />
          </>
        )}
      </div>
    </div>
  );
}
