import type { toolTypes } from "~/constants";

export type ToolType = (typeof toolTypes)[keyof typeof toolTypes] | null;
