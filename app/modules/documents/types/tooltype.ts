import type { Tool } from "../constant/tooltype";

export type ToolType = (typeof Tool)[keyof typeof Tool];
