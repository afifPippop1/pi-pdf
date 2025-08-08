import { ColorTypes, degrees, PDFDocument } from "pdf-lib";
import type { PDFDocumentLoadingTask } from "pdfjs-dist";
import { PDFViewer, toolTypes } from "~/constants";
import { Line, Rectangle } from "~/lib/shape";
import type { Element } from "~/types";
import { getPdfCoordinate } from "./getPdfCoordinate";
import { isShapeElement } from "./isShapeElement";

export async function drawElementsOnPdfDoc(
  loadingTask: PDFDocumentLoadingTask,
  elements: Element[][],
  doc: PDFDocument
): Promise<PDFDocument> {
  const pdfDoc = await doc.copy();
  for (const index of pdfDoc.getPageIndices()) {
    for (const element of elements[index]) {
      const pdfCoordinate = await getPdfCoordinate(
        loadingTask,
        index,
        PDFViewer.SCALE,
        element
      );
      if (isShapeElement(element)) {
        if (element.element instanceof Rectangle) {
          pdfDoc.getPage(index).drawRectangle({
            x: pdfCoordinate.x1,
            y: pdfCoordinate.y1,
            height: Math.abs(pdfCoordinate.y2 - pdfCoordinate.y1),
            width: Math.abs(pdfCoordinate.x2 - pdfCoordinate.x1),
            color: {
              type: ColorTypes.RGB,
              blue: 255,
              green: 255,
              red: 255,
            },
          });
        }
        if (element.element instanceof Line) {
          pdfDoc.getPage(index).drawLine({
            start: {
              x: pdfCoordinate.x1,
              y: pdfCoordinate.y1,
            },
            end: {
              x: pdfCoordinate.x2,
              y: pdfCoordinate.y2,
            },
            color: {
              type: ColorTypes.RGB,
              blue: 0,
              green: 0,
              red: 0,
            },
          });
        }
      } else if (element.type === toolTypes.TEXT) {
        const page = pdfDoc.getPage(index);
        const angle = page.getRotation().angle;
        const rotate =
          angle === 90 || angle === 270 ? degrees(angle) : undefined;
        const x =
          angle === 90 || angle === 270
            ? pdfCoordinate.x1 + 18
            : pdfCoordinate.x1;
        // TODO: FINDOUT this -18
        const y =
          angle === 90 || angle === 270
            ? pdfCoordinate.y1
            : pdfCoordinate.y1 - 18;
        page.drawText(element.text, {
          x,
          y,
          size: 24,

          rotate,
        });
      }
    }
  }
  return pdfDoc;
}
