import type { PDFDocumentLoadingTask } from "pdfjs-dist";
import type { Coordinate2D, Element } from "~/types";
import { getPageFromIndex } from "./getPageFromIndex";
import { toolTypes } from "~/constants";
import { adjustElementCoordinates } from "./adjustElementCoordinates";

export function getPdfCoordinate({
  loadingTask,
  pageIndex,
  scale,
  element,
}: {
  loadingTask: PDFDocumentLoadingTask;
  pageIndex: number;
  scale: number;
  element: Element;
}): Promise<Coordinate2D> {
  return loadingTask.promise.then((pdf) => {
    return pdf.getPage(getPageFromIndex(pageIndex)).then((page) => {
      let pdfCoordinate: Coordinate2D = { x1: 0, y1: 0, x2: 0, y2: 0 };
      const viewport = page.getViewport({ scale: scale });
      if (element.type === toolTypes.RECTANGLE) {
        const [pdfX1, pdfY1] = viewport.convertToPdfPoint(
          element.x1,
          element.y2
        );
        const [pdfX2, pdfY2] = viewport.convertToPdfPoint(
          element.x2,
          element.y1
        );
        const adjustedCoordniate = adjustElementCoordinates({
          ...element,
          x1: pdfX1,
          x2: pdfX2,
          y1: pdfY1,
          y2: pdfY2,
        });
        pdfCoordinate = {
          x1: adjustedCoordniate?.x1 || 0,
          x2: adjustedCoordniate?.x2 || 0,
          y1: adjustedCoordniate?.y1 || 0,
          y2: adjustedCoordniate?.y2 || 0,
        };
      } else if (element.type === toolTypes.LINE) {
        const [pdfX1, pdfY1] = viewport.convertToPdfPoint(
          element.x1,
          element.y1
        );
        const [pdfX2, pdfY2] = viewport.convertToPdfPoint(
          element.x2,
          element.y2
        );
        pdfCoordinate = {
          x1: pdfX1,
          x2: pdfX2,
          y1: pdfY1,
          y2: pdfY2,
        };
      } else if (element.type === toolTypes.TEXT) {
        const [x1, y1] = viewport.convertToPdfPoint(element.x1, element.y1);
        pdfCoordinate = {
          x1,
          x2: 0,
          y1,
          y2: 0,
        };
      }
      return pdfCoordinate;
    });
  });
}
