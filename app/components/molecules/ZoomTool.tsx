import clsx from "clsx";
import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import { PDFViewer } from "~/constants";
import { useZoom } from "~/hooks/useZoom";

const PERCENT = 100;

const STATUS = {
  idle: "idle",
  editing: "editing",
} as const;

export function ZoomTool({ className }: { className?: string }) {
  const { zoom, setZoom } = useZoom();
  const [status, setStatus] = useState<(typeof STATUS)[keyof typeof STATUS]>(
    STATUS.idle
  );
  const [inputValue, setInputValue] = useState((zoom * PERCENT).toFixed(2));
  const zoomStr = (zoom * PERCENT).toFixed(2);

  function decrease() {
    setZoom((z) => Math.max(z - 0.1, PDFViewer.MIN_SCALE));
  }

  function increase() {
    setZoom((z) => Math.min(z + 0.1, PDFViewer.MAX_SCALE));
  }

  function commitValue() {
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      setZoom(
        Math.min(
          Math.max(value / PERCENT, PDFViewer.MIN_SCALE),
          PDFViewer.MAX_SCALE
        )
      );
    } else {
      setInputValue((zoom * PERCENT).toFixed(2));
    }
    setStatus(STATUS.idle);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      commitValue();
    }
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  return (
    <div className={clsx("flex gap-4 items-center", className)}>
      <button onClick={decrease} className="px-4">
        -
      </button>
      <div className="flex">
        {status === STATUS.idle ? (
          <p
            onClick={() => {
              setStatus(STATUS.editing);
              setInputValue((zoom * PERCENT).toFixed(2));
            }}
          >
            {zoomStr}
          </p>
        ) : (
          <input
            autoFocus
            value={inputValue}
            className="w-14 px-1"
            onChange={onChange}
            onBlur={commitValue}
            onKeyDown={onKeyDown}
          />
        )}
        <p>%</p>
      </div>
      <button onClick={increase} className="px-4">
        +
      </button>
    </div>
  );
}
