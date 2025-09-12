import fontkit from "@pdf-lib/fontkit";
import { ColorTypes, degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { PDFDocumentLoadingTask } from "pdfjs-dist";
import { DEGREE, PDFViewer, toolTypes } from "~/constants";
import { Line, Rectangle } from "~/lib/shape";
import type { Coordinate2D, Element, TextElement } from "~/types";
import { getPdfCoordinate } from "./getPdfCoordinate";
import { isShapeElement } from "./isShapeElement";
import { getFontFile } from "./getFontFile";
import type { Color } from "~/types";

export async function drawElementsOnPdfDoc(
  loadingTask: PDFDocumentLoadingTask,
  elements: Element[][],
  doc: PDFDocument
): Promise<PDFDocument> {
  const buffer = await doc.save();
  const pdfDoc = await PDFDocument.load(buffer);
  pdfDoc.registerFontkit(fontkit);

  await drawElements({ elements, pdfDoc, loadingTask });

  return pdfDoc;
}

async function drawElements({
  pdfDoc,
  loadingTask,
  elements,
}: {
  pdfDoc: PDFDocument;
  loadingTask: PDFDocumentLoadingTask;
  elements: Element[][];
}) {
  for (const index of pdfDoc.getPageIndices()) {
    for (const element of elements[index]) {
      const pdfCoordinate = await getPdfCoordinate({
        loadingTask,
        pageIndex: index,
        scale: PDFViewer.SCALE,
        element,
      });

      if (isShapeElement(element)) {
        if (element.element instanceof Rectangle) {
          drawRectangle({
            coordinate: pdfCoordinate,
            element: element.element,
            pageIndex: index,
            pdfDoc,
          });
        }
        if (element.element instanceof Line) {
          drawLine({
            element: element.element,
            coordinate: pdfCoordinate,
            pageIndex: index,
            pdfDoc,
          });
        }
      } else if (element.type === toolTypes.TEXT) {
        await drawText({
          element,
          pdfDoc,
          pageIndex: index,
          coordinate: pdfCoordinate,
        });
      }
    }
  }
}

function generateRGBColor(color: Color) {
  const { a, b, g, r } = color;
  return {
    red: r / 255,
    green: g / 255,
    blue: b / 255,
    alpha: a,
  };
}

async function drawRectangle({
  element,
  pdfDoc,
  pageIndex,
  coordinate,
}: {
  element: Rectangle;
  pdfDoc: PDFDocument;
  pageIndex: number;
  coordinate: Coordinate2D;
}) {
  const { alpha, blue, green, red } = generateRGBColor(element.color);
  const { x1, x2, y1, y2 } = coordinate;
  const height = Math.abs(y2 - y1);
  const width = Math.abs(x2 - x1);

  pdfDoc.getPage(pageIndex).drawRectangle({
    x: x1,
    y: y1,
    height,
    width,
    color: rgb(red, green, blue),
    opacity: alpha,
  });
}

function drawLine({
  element,
  pdfDoc,
  pageIndex,
  coordinate,
}: {
  element: Line;
  pdfDoc: PDFDocument;
  pageIndex: number;
  coordinate: Coordinate2D;
}) {
  pdfDoc.getPage(pageIndex).drawLine({
    start: {
      x: coordinate.x1,
      y: coordinate.y1,
    },
    end: {
      x: coordinate.x2,
      y: coordinate.y2,
    },
    color: {
      type: ColorTypes.RGB,
      blue: 0,
      green: 0,
      red: 0,
    },
  });
}

async function drawText({
  element,
  pdfDoc,
  pageIndex,
  coordinate,
}: {
  element: TextElement;
  pdfDoc: PDFDocument;
  pageIndex: number;
  coordinate: Coordinate2D;
}) {
  const page = pdfDoc.getPage(pageIndex);
  const angle = page.getRotation().angle;
  const fontSize = element.properties.fontSize;
  const verticalOffset = -0.75 * fontSize;
  const horizontalOffset = 0.75 * fontSize;

  const rotate =
    angle === DEGREE.DEG_90 || angle === DEGREE.DEG_270
      ? degrees(angle)
      : undefined;

  const x =
    angle === DEGREE.DEG_90 || angle === DEGREE.DEG_270
      ? coordinate.x1 + horizontalOffset
      : coordinate.x1;

  const y =
    angle === DEGREE.DEG_90 || angle === DEGREE.DEG_270
      ? coordinate.y1
      : coordinate.y1 + verticalOffset;
  const fontUrl = getFontFile(element.properties.fontFamily, "regular");
  let fontBytes: ArrayBuffer | StandardFonts = StandardFonts.Helvetica;
  if (fontUrl) {
    fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
  }
  page.drawText(element.text, {
    x,
    y,
    size: element.properties.fontSize,
    rotate,
    font: await pdfDoc.embedFont(fontBytes),
  });
}
