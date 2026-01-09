import type { PDFDocumentLoadingTask } from "pdfjs-dist";
import { createStore, useStore } from "zustand";
import { getLoadingTask } from "~/modules/documents/utils/getLoadingTask";

type PdfStoreState = {
  loadingTask: PDFDocumentLoadingTask | null;
  buffer: Uint8Array<ArrayBufferLike> | null;
};
type PdfStoreActions = {
  setLoadingTask: (loadingTask: PDFDocumentLoadingTask | null) => void;
  setBuffer: (buffer: Uint8Array<ArrayBufferLike> | null) => void;
};

type PdfStore = PdfStoreState & PdfStoreActions;

const pdfStore = createStore<PdfStore>((set) => ({
  loadingTask: null,
  buffer: null,
  setLoadingTask(loadingTask) {
    set({ loadingTask });
  },
  setBuffer(buffer) {
    const loadingTask = buffer ? getLoadingTask(buffer) : null;
    set({ buffer, loadingTask });
  },
}));

export function usePdfStore<U>(cb: (state: PdfStore) => U) {
  return useStore(pdfStore, cb);
}
