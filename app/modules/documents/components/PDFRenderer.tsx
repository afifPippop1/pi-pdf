import type { RenderTask } from "pdfjs-dist";
import { useEffect, useRef } from "react";

interface PDFRendererProps {
  buffer: Uint8Array<ArrayBufferLike>;
  activeIndex?: number;
}

export default function PDFRenderer({
  buffer,
  activeIndex = 0,
}: PDFRendererProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pdfLibRef = useRef<RenderTask>;

  useEffect(() => {}, []);

  return (
    <canvas
      ref={ref}
      style={
        {
          // touchAction: toolType || selectedElement ? "none" : "auto",
        }
      }
      className="origin-center"
    />
  );
}
