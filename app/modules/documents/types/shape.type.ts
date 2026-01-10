import type { Shape } from "../constant/shape";

export type ShapeType = (typeof Shape)[keyof typeof Shape];
