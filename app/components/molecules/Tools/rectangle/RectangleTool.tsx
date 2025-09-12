import { RectangleBackgroundPickerTool } from "./RectangleBackgroundPickerTool";
import { RectangleOutlinePickerTool } from "./RectangleOutlinePicker";

export function RectangleTool() {
  return (
    <div className="flex flex-col gap-4">
      <RectangleBackgroundPickerTool />
      <RectangleOutlinePickerTool />
    </div>
  );
}
