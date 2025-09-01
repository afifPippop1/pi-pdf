import { toolTypes } from "~/constants";
import { store } from "~/store/store";

export function isRectangleTool(toolType?: string | null) {
  if (toolType) {
    return toolType === toolTypes.RECTANGLE;
  }
  return store.getState().editor.toolType === toolTypes.RECTANGLE;
}

export function isLineTool(toolType?: string) {
  if (toolType) {
    return toolType === toolTypes.LINE;
  }
  return store.getState().editor.toolType === toolTypes.LINE;
}

export function isTextTool(toolType?: string) {
  if (toolType) {
    return toolType === toolTypes.TEXT;
  }
  return store.getState().editor.toolType === toolTypes.TEXT;
}
