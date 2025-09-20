import { PDFDocument } from "pdf-lib";
import { setElements, setPDFDoc } from "~/store/slices/editorSlice";
import { store } from "~/store/store";

export async function addPage() {
  const buffer = await store.getState().editor.pdfDoc?.save();

  const elements = [...store.getState().editor.elements];
  elements.push([]);

  const pdfDoc = await (buffer
    ? PDFDocument.load(buffer)
    : PDFDocument.create());

  pdfDoc.addPage();

  store.dispatch(setPDFDoc(pdfDoc));
  store.dispatch(setElements(elements));
}
