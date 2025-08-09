import type { PDFDocument } from "pdf-lib";

export async function savePdfAsURL(pdfDoc: PDFDocument) {
  const saved = await pdfDoc.save();
  const arrayBuffer = new Uint8Array(saved);
  const blob = new Blob([arrayBuffer], { type: "application/pdf" });
  return URL.createObjectURL(blob);
}
