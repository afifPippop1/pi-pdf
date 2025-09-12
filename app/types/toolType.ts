import type { toolTypes } from "~/constants";
import type { Color } from "~/types";

export type ToolType = (typeof toolTypes)[keyof typeof toolTypes];

export type RectangleProperties = {
  backgroundColor: Color;
};
