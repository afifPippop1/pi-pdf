import type { Element, TextElement } from "~/types";

export function computeTextDimensions({
  element,
  ctx,
}: {
  element: Element<TextElement>;
  ctx: CanvasRenderingContext2D;
}) {
  const lines = element.text.split(/\r?\n/);
  let maxWidth = 0;
  lines.forEach((line) => {
    const lineWidth = ctx?.measureText(line).width || 0;
    if (lineWidth > maxWidth) maxWidth = lineWidth;
  });
  const fontSize = element.properties.fontSize;
  const metrics = ctx?.measureText(lines[0] || "") || {
    actualBoundingBoxAscent: 0,
    actualBoundingBoxDescent: 0,
  };
  const ascent = metrics.actualBoundingBoxAscent || 0;
  const descent = metrics.actualBoundingBoxDescent || 0;
  const lineHeight =
    ascent + descent > 0 ? (ascent + descent) * 1.2 : fontSize * 1.2;
  const blockHeight = lineHeight * lines.length;

  return {
    width: maxWidth,
    height: blockHeight,
  };
}
