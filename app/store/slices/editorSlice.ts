import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PDFDocument } from "pdf-lib";

interface EditorState {
  activePageIndex: number;
  pdfDoc: PDFDocument | null;
}

const initialState: EditorState = {
  activePageIndex: 0,
  pdfDoc: null,
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
  },
});

export const { setActivePageIndex, setPDFDoc } = editorSlice.actions;
export default editorSlice;
