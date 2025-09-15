import { strokeStyle } from "~/constants";
import type { StrokeStyle } from "~/types";

export function getDashValue(style: StrokeStyle) {
  let dash: [number, number] | undefined = undefined;

  if (style === strokeStyle.DASHED) {
    dash = [8, 4];
  } else if (style === strokeStyle.DOTTED) {
    dash = [1, 3];
  }
  return dash;
}
