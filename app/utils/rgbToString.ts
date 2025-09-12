import type { Color } from "~/types";

export function rgbToString({ r, g, b, a }: Color) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
