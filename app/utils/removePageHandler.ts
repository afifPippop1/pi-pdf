import {
  setActivePageIndex,
  setElements,
  setPDFDoc,
} from "~/store/slices/editorSlice";
import { store } from "~/store/store";

export async function removePageHandler(
  index: number,
  bufferHandler: (buffer: Uint8Array | null) => void
) {
  const pdfDoc = store.getState().editor.pdfDoc;
  const activePageIndex = store.getState().editor.activePageIndex;
  const elements = store.getState().editor.elements;

  if (!pdfDoc) return;
  if (pdfDoc.getPageCount() === 1) {
    store.dispatch(setPDFDoc(null));
    bufferHandler(null);
  } else {
    if (activePageIndex === index) {
      if (activePageIndex !== 0) {
        store.dispatch(setActivePageIndex(index - 1));
      }
    }
    pdfDoc.removePage(index);
    const el = elements.filter((_, idx) => idx !== index);
    store.dispatch(setElements(el));
    const buffer = await pdfDoc.save();
    bufferHandler(buffer);
  }
}
