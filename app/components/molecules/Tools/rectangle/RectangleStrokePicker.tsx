import { StrokePicker } from "../StrokePicker";

export function RectangleStrokePicker() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs">Stroke width</p>
      <StrokePicker />
    </div>
  );
}
