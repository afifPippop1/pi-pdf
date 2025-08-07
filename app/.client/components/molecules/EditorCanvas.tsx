import * as pdfjsLib from "pdfjs-dist";
import { useState } from "react";
import { Whiteboard } from "~/.client/components/molecules/Whiteboard";
import { useZoom } from "~/hooks/useZoom";
import { useAppSelector } from "~/store/hooks";
import { PdfViewer } from "./PDFViewer";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface EditorCanvasProps {
  buffer: Uint8Array;
}

export function EditorCanvas(props: EditorCanvasProps) {
  const [pdfReady, setPdfReady] = useState(false);
  const { zoom } = useZoom({ onChange: () => setPdfReady(false) });
  const activePageIndex = useAppSelector((s) => s.editor.activePageIndex);
  return (
    <div className="relative">
      <PdfViewer
        pdfData={props.buffer}
        pageIndex={activePageIndex}
        scale={zoom}
        onPdfRendered={() => setPdfReady(true)}
      />
      <Whiteboard scale={zoom} readyToRender={pdfReady} buffer={props.buffer} />
    </div>
  );
}
