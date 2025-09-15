import type { ReactNode } from "react";
import { DashedIcon } from "~/components/atoms/DashedIcon";
import { DottedIcon } from "~/components/atoms/DottedIcon";
import { ThinStroke } from "~/components/atoms/ThinStroke";
import { strokeStyle } from "~/constants";
import type { StrokeStyle } from "~/types";


interface StrokeStylePickerProps {
  onChange: (style: StrokeStyle) => void;
  activeStyle: StrokeStyle;
}

export function StrokeStylePicker({
  activeStyle,
  onChange,
}: StrokeStylePickerProps) {
  return (
    <div className="flex gap-4">
      <StrokeItem
        value={strokeStyle.LINE}
        onClick={onChange}
        activeStyle={activeStyle}
      >
        <ThinStroke />
      </StrokeItem>
      <StrokeItem
        value={strokeStyle.DASHED}
        onClick={onChange}
        activeStyle={activeStyle}
      >
        <DashedIcon />
      </StrokeItem>
      <StrokeItem
        value={strokeStyle.DOTTED}
        onClick={onChange}
        activeStyle={activeStyle}
      >
        <DottedIcon />
      </StrokeItem>
    </div>
  );
}

export function StrokeItem({
  children,
  onClick,
  activeStyle,
  value,
}: {
  value: StrokeStyle;
  children: ReactNode;
  activeStyle: StrokeStyle;
  onClick: (value: StrokeStyle) => void;
}) {
  return (
    <div
      className={`btn btn-xs [&>svg]:w-4 [&>svg]:h-4 ${
        activeStyle === value && "bg-primary/30"
      }`}
      onClick={() => onClick(value)}
    >
      {children}
    </div>
  );
}
