import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PDFDocument } from "pdf-lib";

interface EditorState {
  activePage: number;
  pdfDoc: PDFDocument | null;
  readonlyDoc: PDFDocument | null;
  files: File[];
}

const initialState: EditorState = {
  activePage: 1,
  pdfDoc: null,
  readonlyDoc: null,
  files: [],
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setActivePage(state, action: PayloadAction<number>) {
      state.activePage = action.payload;
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

export const { setActivePage, setPDFDoc, setReadonlyDoc, setFiles } =
  editorSlice.actions;
export default editorSlice;
