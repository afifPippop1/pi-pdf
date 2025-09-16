import type { LineProperties } from "~/types";

export class Line {
  constructor(
    public x1: number,
    public y1: number,
    public x2: number,
    public y2: number,
    public options: LineProperties
  ) {}
}
