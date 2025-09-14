import type { ReactNode } from "react";

interface StrokePickerProps {
  onChange: (width: number) => void;
  width: number;
}

export function StrokePicker({ onChange, width }: StrokePickerProps) {
  return (
    <div className="flex gap-4">
      <StrokeItem label="Thin" width={2} onClick={onChange} activeWidth={width}>
        <ThinStroke />
      </StrokeItem>
      <StrokeItem label="Bold" width={4} onClick={onChange} activeWidth={width}>
        <BoldStroke />
      </StrokeItem>
      <StrokeItem
        label="Extra bold"
        width={6}
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
      className={`btn [&>svg]:w-4 [&>svg]:h-4 ${
        activeWidth === width && "bg-primary/30"
      }`}
      onClick={() => onClick(width)}
    >
      {children}
    </div>
  );
}

function ThinStroke() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M4.167 10h11.666"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}

function BoldStroke() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M5 10h10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}

function ExtraBoldStroke() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M5 10h10"
        stroke="currentColor"
        strokeWidth="3.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
