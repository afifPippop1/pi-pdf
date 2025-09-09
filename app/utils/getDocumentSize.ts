import type { PDFDocument } from "pdf-lib";
import { DEGREE, PDFViewer } from "~/constants";
import { store } from "~/store/store";

export function getDocumentSize(
  pdfDoc: PDFDocument | null,
  scale: number = PDFViewer.SCALE
) {
  const activePageIndex = store.getState().editor.activePageIndex;
  if (!pdfDoc) return { height: 0, width: 0 };

  const angle = pdfDoc?.getPage(0).getRotation().angle;
  const size = {
    height: (pdfDoc?.getPage(activePageIndex).getHeight() || 0) * scale,
    width: (pdfDoc?.getPage(activePageIndex).getWidth() || 0) * scale,
  };
  if (angle === DEGREE.DEG_90 || angle === DEGREE.DEG_270) {
    return { height: size.width, width: size.height };
  }
  return size;
}
