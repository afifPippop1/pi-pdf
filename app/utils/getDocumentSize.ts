import type { PDFDocument } from "pdf-lib";
import React from "react";
import { PDFViewer } from "~/constants";

export function getDocumentSize(
  pdfDoc: PDFDocument | null,
  activePageIndex: number
) {
  if (!pdfDoc) return { height: 0, width: 0 };
  return {
    height:
      (pdfDoc?.getPage(activePageIndex).getHeight() || 0) * PDFViewer.SCALE,
    width: (pdfDoc?.getPage(activePageIndex).getWidth() || 0) * PDFViewer.SCALE,
  };
}
