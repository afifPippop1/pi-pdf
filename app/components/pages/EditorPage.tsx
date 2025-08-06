import { useState } from "react";
import { useDispatch } from "react-redux";
import { useDocBuffer } from "~/hooks/useDocBuffer";
import { useZoom } from "~/hooks/useZoom";
import { useAppSelector } from "~/store/hooks";
import {
  setActivePageIndex,
  setElements,
  setPDFDoc,
} from "~/store/slices/editorSlice";
import { getPageFromIndex } from "~/utils";
import { Button } from "../atoms/Button";
import ContextMenu, {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  type Option,
} from "../molecules/ContextMenu";
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
  const [pdfReady, setPdfReady] = useState(false);
  const { zoom } = useZoom({ onChange: () => setPdfReady(false) });

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
                  <ContextMenu key={index}>
                    <ContextMenuTrigger>
                      <Button
                        key={index}
                        onClick={() => dispatch(setActivePageIndex(index))}
                      >
                        {getPageFromIndex(index)}
                      </Button>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        onClick={async () => {
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
                            const el = elements.filter(
                              (_, idx) => idx !== index
                            );
                            dispatch(setElements(el));
                            const buffer = await pdfDoc.save();
                            setBlob(buffer);
                          }
                        }}
                      >
                        Remove
                      </ContextMenuItem>
                    </ContextMenuContent>
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
