import { INTERACTION } from "../constant/interaction";
import type { Bounds } from "./bounds.type";

export type ResizeHandle = "nw" | "ne" | "sw" | "se";

export type Interaction =
  | { type: typeof INTERACTION.Iddle }
  | { type: typeof INTERACTION.Drawing }
  | { type: typeof INTERACTION.Dragging }
  | { type: typeof INTERACTION.Scaling; handle: ResizeHandle; bounds: Bounds };
