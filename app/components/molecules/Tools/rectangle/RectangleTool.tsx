import { RectangleBackgroundPickerTool } from "./RectangleBackgroundPickerTool";
import { RectangleOutlinePickerTool } from "./RectangleOutlinePicker";
import { RectangleStrokePicker } from "./RectangleStrokePicker";
import { RectangleStrokeStylePicker } from "./RectangleStrokeStylePicker";

export function RectangleTool() {
  return (
    <div className="flex flex-col gap-4 py-2">
      <RectangleBackgroundPickerTool />
      <RectangleOutlinePickerTool />
      <RectangleStrokePicker />
      <RectangleStrokeStylePicker />
    </div>
  );
}
