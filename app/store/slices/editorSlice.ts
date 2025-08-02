import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PDFDocument } from "pdf-lib";
import type { Element, ToolType } from "~/types";

interface EditorState {
  activePageIndex: number;
  pdfDoc: PDFDocument | null;
  readonlyDoc: PDFDocument | null;
  files: File[];
  elements: Element[];
  toolType: ToolType | null;
}

const initialState: EditorState = {
  activePageIndex: 0,
  pdfDoc: null,
  readonlyDoc: null,
  files: [],
  elements: [],
  // toolType: null,
  toolType: "RECTANGLE",
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
    },
    setReadonlyDoc(state, action: PayloadAction<PDFDocument | null>) {
      state.readonlyDoc = action.payload;
    },
    setFiles(state, action: PayloadAction<File[]>) {
      state.files = action.payload;
    },
    setToolType: (state, action: PayloadAction<ToolType | null>) => {
      state.toolType = action.payload;
    },
    updateElement(state, action: PayloadAction<Element>) {
      const { id } = action.payload;

      const index = state.elements.findIndex((el) => el.id === id);
      if (index === -1) {
        state.elements.push(action.payload);
      } else {
        state.elements[index] = action.payload;
      }
    },
    setElements(state, action: PayloadAction<Element[]>) {
      state.elements = action.payload;
    },
  },
});

export const {
  setActivePageIndex,
  setPDFDoc,
  setReadonlyDoc,
  setFiles,
  setToolType,
  updateElement,
  setElements,
} = editorSlice.actions;
export default editorSlice;
