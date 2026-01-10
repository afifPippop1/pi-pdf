import { PDFDocument } from "pdf-lib";
import type { PDFDocumentLoadingTask } from "pdfjs-dist";
import { createStore, useStore } from "zustand";
import { getLoadingTask } from "~/modules/documents/utils/getLoadingTask";
import { getPageSize } from "../utils/getPageSize";

type PdfStoreState = {
  loadingTask: PDFDocumentLoadingTask | null;
  buffer: Uint8Array<ArrayBufferLike> | null;
  doc: PDFDocument | null;
  size: { height: number; width: number };
};
type PdfStoreActions = {
  setLoadingTask: (loadingTask: PDFDocumentLoadingTask | null) => void;
  setBuffer: (buffer: Uint8Array<ArrayBufferLike> | null) => Promise<void>;
};

type PdfStore = PdfStoreState & PdfStoreActions;

const pdfStore = createStore<PdfStore>((set, get) => ({
  loadingTask: null,
  buffer: null,
  doc: null,
  size: { height: 0, width: 0 },
  setLoadingTask(loadingTask) {
    set({ loadingTask });
  },
  async setBuffer(buffer) {
    const loadingTask = buffer ? getLoadingTask(buffer) : null;
    const doc = buffer ? await PDFDocument.load(buffer) : null;
    set({ buffer, loadingTask, doc });
  },
}));

export function usePdfStore<U>(cb: (state: PdfStore) => U) {
  return useStore(pdfStore, cb);
}
