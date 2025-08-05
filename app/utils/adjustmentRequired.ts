import type { ToolType } from "~/types";
import { toolTypes } from "../constants";

export function adjustmentRequired(toolType: ToolType): boolean {
  return new Set<ToolType>([toolTypes.RECTANGLE, toolTypes.LINE]).has(toolType);
}
