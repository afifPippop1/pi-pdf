import type { PDFDocument } from "pdf-lib";

export async function savePdfAsURL(pdfDoc: PDFDocument) {
  const saved = await pdfDoc.save();
  const blob = new Blob([saved], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  return url;
}
