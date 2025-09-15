import type { ReactNode } from "react";
import { BoldStroke } from "~/components/atoms/BoldStroke";
import { ExtraBoldStroke } from "~/components/atoms/ExtraBoldStroke";
import { ThinStroke } from "~/components/atoms/ThinStroke";

interface StrokePickerProps {
  onChange: (width: number) => void;
  width: number;
}

export function StrokePicker({ onChange, width }: StrokePickerProps) {
  return (
    <div className="flex gap-4">
      <StrokeItem label="Thin" width={1} onClick={onChange} activeWidth={width}>
        <ThinStroke />
      </StrokeItem>
      <StrokeItem label="Bold" width={2} onClick={onChange} activeWidth={width}>
        <BoldStroke />
      </StrokeItem>
      <StrokeItem
        label="Extra bold"
        width={4}
        onClick={onChange}
        activeWidth={width}
      >
        <ExtraBoldStroke />
      </StrokeItem>
    </div>
  );
}

export function StrokeItem({
  children,
  onClick,
  width,
  activeWidth,
}: {
  label: string;
  children: ReactNode;
  width: number;
  activeWidth: number;
  onClick: (width: number) => void;
}) {
  return (
    <div
      className={`btn btn-xs [&>svg]:w-4 [&>svg]:h-4 ${
        activeWidth === width && "bg-primary/30"
      }`}
      onClick={() => onClick(width)}
    >
      {children}
    </div>
  );
}
