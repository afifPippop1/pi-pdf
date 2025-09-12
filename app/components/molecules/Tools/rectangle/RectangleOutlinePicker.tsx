import { ColorPicker } from "../ColorPicker";

export function RectangleOutlinePickerTool() {
  return (
    <ColorPicker
      title="Outline color"
      onChange={(color) => {
        console.log(color);
      }}
    />
  );
}
