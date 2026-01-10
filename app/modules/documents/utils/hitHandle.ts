export function hitHandle(
  mouseX: number,
  mouseY: number,
  handleX: number,
  handleY: number,
  size: number
) {
  const half = size / 2;
  return (
    mouseX >= handleX - half &&
    mouseX <= handleX + half &&
    mouseY >= handleY - half &&
    mouseY <= handleY + half
  );
}
