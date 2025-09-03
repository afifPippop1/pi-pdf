import { useState } from "react";
import { Whiteboard } from "~/components/molecules/Whiteboard.client";
import { useZoom } from "~/hooks/useZoom";
import { useAppSelector } from "~/store/hooks";
import { PdfViewer } from "./PDFViewer.client";

interface EditorCanvasProps {
  buffer: Uint8Array;
}

export function EditorCanvas(props: EditorCanvasProps) {
  const activePageIndex = useAppSelector((s) => s.editor.activePageIndex);
  return (
    <div className="relative">
      <PdfViewer pdfData={props.buffer} pageIndex={activePageIndex} />
      <Whiteboard />
    </div>
  );
}
