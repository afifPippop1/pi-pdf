import { RgbaColorPicker, type RgbaColor } from "react-colorful";
import type { Color } from "~/types";
import { rgbToString } from "~/utils";
import Popover, { PopoverContent, PopoverTrigger } from "../Popover";

const whiteColor = rgbToString({ r: 255, g: 255, b: 255, a: 1 });
const whiteColorTransparent = rgbToString({ r: 255, g: 255, b: 255, a: 0 });

const defaultColorOptions: Color[] = [
  { r: 30, g: 30, b: 30, a: 1 },
  { r: 224, g: 49, b: 49, a: 1 },
  { r: 47, g: 158, b: 68, a: 1 },
  { r: 25, g: 113, b: 194, a: 1 },
  { r: 240, g: 140, b: 0, a: 1 },
];

interface ColorPickerProps {
  color: Color;
  onChange: (color: RgbaColor) => void;
  title?: string;
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <div className="flex gap-2 items-center px-2">
      {defaultColorOptions.map((colorOpt, index) => (
        <div
          key={index}
          className={`${rgbToString(colorOpt) === rgbToString(color) && "outline outline-gray-400 rounded p-0.5"}`}
        >
          <ColorItem key={index} color={colorOpt} onClick={onChange} />
        </div>
      ))}
      <span className="text-gray-300">|</span>
      <Popover>
        <PopoverTrigger>
          <ColorItem color={color} custom />
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-2 text-xs">
            <p>Colors</p>
            <RgbaColorPicker color={color} onChange={onChange} />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function ColorItem({
  color,
  custom,
  onClick,
}: {
  color: Color;
  custom?: boolean;
  onClick?: (color: Color) => void;
}) {
  const backgroundColor = rgbToString(color);
  return (
    <div
      onClick={() => onClick?.(color)}
      className={`${!custom ? "w-6 h-6" : "w-7 h-7"} ${
        !custom && "transition-transform hover:scale-125"
      } rounded cursor-pointer ${
        (backgroundColor === whiteColor ||
          backgroundColor === whiteColorTransparent) &&
        "border border-gray-300"
      }`}
      style={{ backgroundColor }}
    ></div>
  );
}
