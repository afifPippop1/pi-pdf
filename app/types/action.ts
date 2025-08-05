import type { actions } from "~/constants";

export type Action = (typeof actions)[keyof typeof actions];
