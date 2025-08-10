import type { Color } from "~/lib/shape/rectangle";

export function rgbToString({ r, g, b, a }: Color) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
