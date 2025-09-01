import { ColorTypes, degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { PDFDocumentLoadingTask } from "pdfjs-dist";
import { PDFViewer, toolTypes } from "~/constants";
import { Line, Rectangle } from "~/lib/shape";
import type { Element } from "~/types";
import { getPdfCoordinate } from "./getPdfCoordinate";
import { isShapeElement } from "./isShapeElement";
import fontkit from "@pdf-lib/fontkit";

export async function drawElementsOnPdfDoc(
  loadingTask: PDFDocumentLoadingTask,
  elements: Element[][],
  doc: PDFDocument
): Promise<PDFDocument> {
  const buffer = await doc.save();
  const pdfDoc = await PDFDocument.load(buffer);
  pdfDoc.registerFontkit(fontkit);
  console.log(StandardFonts.Helvetica);
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
          const { a: alpha, b: blue, g: green, r: red } = element.element.color;
          pdfDoc.getPage(index).drawRectangle({
            x: pdfCoordinate.x1,
            y: pdfCoordinate.y1,
            height: Math.abs(pdfCoordinate.y2 - pdfCoordinate.y1),
            width: Math.abs(pdfCoordinate.x2 - pdfCoordinate.x1),
            color: rgb(red / 255, green / 255, blue / 255),
            opacity: alpha,
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
        const url = "https://pdf-lib.js.org/assets/ubuntu/Ubuntu-R.ttf";
        const ubuntuBytes = await fetch(url).then((res) => res.arrayBuffer());

        page.drawText(element.text, {
          x,
          y,
          size: 24,
          rotate,
          font: await pdfDoc.embedFont(ubuntuBytes),
        });
      }
    }
  }
  return pdfDoc;
}
