import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { PDFDocument } from "pdf-lib";
import type { Element, ToolType } from "~/types";
import { swapArrayValue } from "~/utils";

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

export const reorderPage = createAsyncThunk<
  { doc: PDFDocument; elements: Element[][] }, // return type
  { active: number; over: number }, // argument type
  { state: { editor: EditorState } } // thunkAPI type
>("editor/reorderPage", async ({ active, over }, thunkAPI) => {
  const state = thunkAPI.getState().editor;
  if (!state.pdfDoc) throw new Error("No PDF document loaded");

  // Create the current order
  const orderArray = Array.from(
    { length: state.pdfDoc.getPageCount() },
    (_, index) => index
  );

  const elements = [...state.elements];
  // Swap positions
  swapArrayValue(orderArray, active, over);
  swapArrayValue(elements, active, over);

  // Create new doc with reordered pages
  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(state.pdfDoc, orderArray);
  pages.forEach((p) => newPdf.addPage(p));

  return { doc: newPdf, elements };
});

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
    reorderPage(
      state,
      action: PayloadAction<{ active: number; over: number }>
    ) {
      const orderArray = Array.from(
        { length: state.pdfDoc?.getPageCount() || 0 },
        (_, index) => index
      );
      swapArrayValue(orderArray, action.payload.active, action.payload.over);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(reorderPage.fulfilled, (state, action) => {
      state.pdfDoc = action.payload.doc;
      state.elements = action.payload.elements;
    });
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
