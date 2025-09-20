import { PDFDocument } from "pdf-lib";
import {
  setElements,
  setPDFDoc as setPDFDocSlice,
} from "~/store/slices/editorSlice";
import { store } from "~/store/store";

export async function setPDFDoc(files: File[]) {
  const buffer = await store.getState().editor.pdfDoc?.save();

  const pdfDoc = await (buffer
    ? PDFDocument.load(buffer)
    : PDFDocument.create());

  const elements = [...store.getState().editor.elements];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const loadedDoc = await PDFDocument.load(arrayBuffer);

    const copiedPages = await pdfDoc.copyPages(
      loadedDoc,
      loadedDoc.getPageIndices()
    );
    copiedPages.forEach((page) => {
      pdfDoc.addPage(page);
      elements.push([]);
    });
  }

  store.dispatch(setPDFDocSlice(pdfDoc));
  store.dispatch(setElements(elements));
}
