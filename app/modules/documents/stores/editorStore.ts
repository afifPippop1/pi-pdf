import { createStore, useStore } from "zustand";
import type { Element } from "~/types";
import type { Document, DocumentWithBlob } from "~/types/documents.type";
import type { ToolType } from "../types/tooltype";

interface EditorStoreState {
  document: DocumentWithBlob | null;
  activePageIndex: number;
  elements: Element[][];
  zoomLevel: number;
  state: "loading" | "ready" | "error";
  tool: ToolType;
}

interface EditorStoreAction {
  setDocument(document: Document | null): void;
  setZoomLevel(zoomLevel: number): void;
  setTool(tool: ToolType): void;
}

type DocumentStore = EditorStoreState & EditorStoreAction;

const documentStore = createStore<DocumentStore>((set) => ({
  tool: "select",
  activePageIndex: 0,
  document: null,
  elements: [],
  state: "loading",
  zoomLevel: 1,

  setDocument: (document: DocumentWithBlob | null) => set({ document }),
  setZoomLevel: (zoomLevel) => set({ zoomLevel }),
  setTool: (tool) => set({ tool }),
}));

export function useEditorStore<U>(selector: (state: DocumentStore) => U) {
  return useStore(documentStore, selector);
}
