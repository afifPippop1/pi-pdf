import { RgbaColorPicker, type RgbaColor } from "react-colorful";
import type { Color } from "~/lib/shape/rectangle";

const defaultColor = {
  a: 1,
  r: 255,
  g: 255,
  b: 255,
} as Color;

interface ColorPickerProps {
  color?: Color;
  onChange: (color: RgbaColor) => void;
  title?: string;
}

export function ColorPicker({ color, onChange, title }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      {!!title && <p className="text-sm">{title}</p>}
      <RgbaColorPicker color={color || defaultColor} onChange={onChange} />
    </div>
  );
}
