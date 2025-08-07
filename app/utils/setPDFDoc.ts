import { PDFDocument } from "pdf-lib";
import { setPDFDoc as setPDFDocSlice } from "~/store/slices/editorSlice";
import { store } from "~/store/store";

export async function setPDFDoc(files: File[]) {
  const pdfDoc = await store.getState().editor.pdfDoc?.copy();

  const newDoc = await (pdfDoc ? pdfDoc : PDFDocument.create());

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const loadedDoc = await PDFDocument.load(arrayBuffer);
    const copiedPages = await newDoc.copyPages(
      loadedDoc,
      loadedDoc.getPageIndices()
    );
    copiedPages.forEach((page) => newDoc.addPage(page));
  }

  store.dispatch(setPDFDocSlice(newDoc));
}
