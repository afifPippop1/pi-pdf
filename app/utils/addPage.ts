import { PDFDocument } from "pdf-lib";
import { setPDFDoc } from "~/store/slices/editorSlice";
import { store } from "~/store/store";

export async function addPage() {
  const buffer = await store.getState().editor.pdfDoc?.save();

  const pdfDoc = await (buffer
    ? PDFDocument.load(buffer)
    : PDFDocument.create());

  pdfDoc.addPage();

  store.dispatch(setPDFDoc(pdfDoc));
}
