import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PDFDocument } from "pdf-lib";

interface EditorState {
  activePageIndex: number;
  pdfDoc: PDFDocument | null;
  readonlyDoc: PDFDocument | null;
  files: File[];
}

const initialState: EditorState = {
  activePageIndex: 0,
  pdfDoc: null,
  readonlyDoc: null,
  files: [],
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
  },
});

export const { setActivePageIndex, setPDFDoc, setReadonlyDoc, setFiles } =
  editorSlice.actions;
export default editorSlice;
