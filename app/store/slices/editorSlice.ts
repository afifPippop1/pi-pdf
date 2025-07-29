import { createSlice } from "@reduxjs/toolkit";

interface EditorState {}

const initialState: EditorState = {};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {},
});

export const {} = editorSlice.actions;
export default editorSlice;
