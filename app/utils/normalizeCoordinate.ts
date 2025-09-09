export function normalizeCoordinate({
  x,
  y,
  bounding,
  zoom,
}: {
  x: number;
  y: number;
  bounding: DOMRect;
  zoom: number;
}) {
  return {
    x: (x - bounding.left) / zoom,
    y: (y - bounding.top) / zoom,
  };
}
