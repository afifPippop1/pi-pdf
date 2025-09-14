import { RectangleBackgroundPickerTool } from "./RectangleBackgroundPickerTool";
import { RectangleOutlinePickerTool } from "./RectangleOutlinePicker";
import { RectangleStrokePicker } from "./RectangleStrokePicker";

export function RectangleTool() {
  return (
    <div className="flex flex-col gap-4">
      <RectangleBackgroundPickerTool />
      <RectangleOutlinePickerTool />
      <RectangleStrokePicker />
    </div>
  );
}
