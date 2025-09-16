import { LineColorPicker } from "./LineColorPicker";
import { LineStrokePicker } from "./RectangleStrokePicker";
import { LineStrokeStylePicker } from "./RectangleStrokeStylePicker";

export function LineTools() {
  return (
    <div className="flex flex-col gap-4 py-2">
      <LineColorPicker />
      <LineStrokePicker />
      <LineStrokeStylePicker />
    </div>
  );
}
