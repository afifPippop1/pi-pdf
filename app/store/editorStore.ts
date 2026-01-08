import { createStore, useStore } from "zustand";
import type { Element } from "~/types";
import type { Document, DocumentWithBlob } from "~/types/documents.type";

interface EditorStoreState {
  document: DocumentWithBlob | null;
  activePageIndex: number;
  elements: Element[][];
  zoomLevel: number;
  state: "loading" | "ready" | "error";
}

interface EditorStoreAction {
  setDocument(document: Document | null): void;
  setZoomLevel(zoomLevel: number): void;
}

type DocumentStore = EditorStoreState & EditorStoreAction;

const documentStore = createStore<DocumentStore>((set) => ({
  activePageIndex: 0,
  document: null,
  elements: [],
  state: "loading",
  zoomLevel: 1,
  setDocument(document: DocumentWithBlob | null) {
    set({ document });
  },
  setZoomLevel(zoomLevel) {
    set({ zoomLevel });
  },
}));

export function useEditorStore<U>(selector: (state: DocumentStore) => U) {
  return useStore(documentStore, selector);
}
