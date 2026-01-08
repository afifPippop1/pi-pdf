import { createStore, useStore } from "zustand";
import type { Element } from "~/types";
import type { Document, DocumentWithBlob } from "~/types/documents.type";

interface EditorStoreState {
  document: DocumentWithBlob | null;
  activePageIndex: number;
  elements: Element[][];
  state: "loading" | "ready" | "error";
}

interface EditorStoreAction {
  setDocument(document: Document | null): void;
}

type DocumentStore = EditorStoreState & EditorStoreAction;

const documentStore = createStore<DocumentStore>((set) => ({
  activePageIndex: 0,
  document: null,
  elements: [],
  state: "loading",
  setDocument(document: DocumentWithBlob | null) {
    set({ document });
  },
}));

export function useEditorStore<U>(selector: (state: DocumentStore) => U) {
  return useStore(documentStore, selector);
}
