import type { INTERACTION } from "../constant/interaction";

export type Interaction = (typeof INTERACTION)[keyof typeof INTERACTION];
