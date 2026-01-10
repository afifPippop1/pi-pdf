import { createStore, useStore } from "zustand";
import type { Document, DocumentWithBlob } from "~/types/documents.type";
import type { Element } from "../models/Element";
import type { ToolType } from "../types/tooltype";

interface EditorStoreState {
  document: DocumentWithBlob | null;
  activePageIndex: number;
  elements: Element[][];
  zoomLevel: number;
  state: "loading" | "ready" | "error";
  tool: ToolType;
  activeElement: Element | null;
}

interface EditorStoreAction {
  setDocument(document: Document | null): void;
  setZoomLevel(zoomLevel: number): void;
  setTool(tool: ToolType): void;
  addElement(element: Element, index?: number): void;
  updateElement: (element: Element, index?: number) => void;
  setActiveElement(element: Element | null): void;
}

type DocumentStore = EditorStoreState & EditorStoreAction;

const documentStore = createStore<DocumentStore>((set, get) => ({
  tool: "select",
  activePageIndex: 0,
  document: null,
  elements: [],
  state: "loading",
  zoomLevel: 1,
  activeElement: null,

  setDocument: (document: DocumentWithBlob | null) => set({ document }),
  setZoomLevel: (zoomLevel) => set({ zoomLevel }),
  setTool: (tool) => set({ tool }),
  addElement: (element, index) => {
    index = index || get().activePageIndex;
    const elements = [...get().elements];
    if (!elements[index]) elements[index] = [];
    elements[index].push(element);
    set({ elements: elements, activeElement: element });
  },
  updateElement: (element, index) => {
    index = index ?? get().activePageIndex;

    const elements = [...get().elements];
    const pageElements = elements[index] ?? [];

    const elementIndex = pageElements.findIndex((el) => el.id === element.id);

    if (elementIndex === -1) {
      pageElements.push(element);
    } else {
      pageElements[elementIndex] = element;
    }

    elements[index] = pageElements;
    set({ elements });
  },
  setActiveElement: (element) => set({ activeElement: element }),
}));

export function useEditorStore<U>(selector: (state: DocumentStore) => U) {
  return useStore(documentStore, selector);
}
