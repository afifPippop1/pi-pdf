import { store } from "~/store/store";
import { getActivePageElements } from "./getActivePageElements";

export function getActiveElementIndex() {
  const selectedElement = store.getState().editor.selectedElement;
  const elements = getActivePageElements();
  return elements.findIndex((element) => element.id === selectedElement?.id);
}
