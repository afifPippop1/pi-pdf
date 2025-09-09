import { store } from "~/store/store";

export function getActivePageElements() {
  const activePageIndex = store.getState().editor.activePageIndex;
  const element = store.getState().editor.elements;
  return element[activePageIndex] || [];
}
