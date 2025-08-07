import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PDFDocument } from "pdf-lib";
import type { Element, ToolType } from "~/types";

interface EditorState {
  activePageIndex: number;
  pdfDoc: PDFDocument | null;
  readonlyDoc: PDFDocument | null;
  elements: Element[][];
  toolType: ToolType | null;
}

const initialState: EditorState = {
  activePageIndex: 0,
  pdfDoc: null,
  readonlyDoc: null,
  elements: [],
  toolType: null,
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setActivePageIndex(state, action: PayloadAction<number>) {
      state.activePageIndex = action.payload;
    },
    setPDFDoc(state, action: PayloadAction<PDFDocument | null>) {
      state.pdfDoc = action.payload;
      if (action.payload) {
        const length = action.payload?.getPageIndices().length;
        if (length) {
          const elements = Array(length).fill([] as Element[]);
          state.elements = elements;
        }
      } else {
        state.elements = [];
      }
    },
    setToolType: (state, action: PayloadAction<ToolType | null>) => {
      state.toolType = action.payload;
    },
    updateElement(state, action: PayloadAction<Element>) {
      if (state.activePageIndex === null) return;
      const { id } = action.payload;

      const index = state.elements[state.activePageIndex].findIndex(
        (el) => el.id === id
      );
      if (index === -1) {
        state.elements[state.activePageIndex].push(action.payload);
      } else {
        state.elements[state.activePageIndex][index] = action.payload;
      }
    },
    setElements(state, action: PayloadAction<Element[][]>) {
      state.elements = action.payload;
    },
    setActivePageElements(state, action: PayloadAction<Element[]>) {
      if (state.activePageIndex === null) return;
      state.elements[state.activePageIndex] = action.payload;
    },
  },
});

export const {
  setActivePageIndex,
  setPDFDoc,
  setToolType,
  updateElement,
  setElements,
  setActivePageElements,
} = editorSlice.actions;
export default editorSlice;
