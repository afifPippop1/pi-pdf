import { PDFDocument } from "pdf-lib";
import { setPDFDoc as setPDFDocSlice } from "~/store/slices/editorSlice";
import { store } from "~/store/store";

export async function setPDFDoc(files: File[]) {
  const buffer = await store.getState().editor.pdfDoc?.save();

  const pdfDoc = await (buffer
    ? PDFDocument.load(buffer)
    : PDFDocument.create());

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const loadedDoc = await PDFDocument.load(arrayBuffer);
    const copiedPages = await pdfDoc.copyPages(
      loadedDoc,
      loadedDoc.getPageIndices()
    );
    copiedPages.forEach((page) => pdfDoc.addPage(page));
  }

  store.dispatch(setPDFDocSlice(pdfDoc));
}
