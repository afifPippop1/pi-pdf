import { ColorTypes, PDFDocument } from "pdf-lib";
import { Line, Rectangle } from "~/lib/shape";
import type { Element } from "~/types";

export async function drawElementsOnPdfDoc(
  elements: Element[][],
  doc: PDFDocument
): Promise<PDFDocument> {
  const pdfDoc = await PDFDocument.load(await doc.save());
  pdfDoc.getPageIndices().map((index) => {
    const page = pdfDoc.getPage(index);
    const pageHeight = page.getHeight();
    elements[index].forEach(({ element }) => {
      if (element instanceof Rectangle) {
        const { x, y, width, height } = element;
        pdfDoc.getPage(index).drawRectangle({
          x,
          y: pageHeight - y - height,
          height,
          width,
          color: {
            type: ColorTypes.RGB,
            blue: 255,
            green: 255,
            red: 255,
          },
        });
      }
      if (element instanceof Line) {
        const { x1, y1, x2, y2 } = element;
        pdfDoc.getPage(index).drawLine({
          start: {
            x: x1,
            y: pageHeight - y1,
          },
          end: {
            x: x2,
            y: pageHeight - y2,
          },
          color: {
            type: ColorTypes.RGB,
            blue: 0,
            green: 0,
            red: 0,
          },
        });
      }
    });
  });
  return pdfDoc;
}
