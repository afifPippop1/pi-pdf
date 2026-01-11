import { cva } from "class-variance-authority";
import * as pdfjsLib from "pdfjs-dist";
import { useEffect, useState, type ComponentProps } from "react";
import { useEditorStore } from "~/modules/documents/stores/editorStore";
import PDFRenderer from "./PDFRenderer";
import Whiteboard from "./Whiteboard";
import { cn } from "~/lib/utils";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const DocumentEditorVariants = cva("relative w-max", {
  variants: {},
  defaultVariants: {},
});

export default function DocumentEditor({ className }: ComponentProps<"div">) {
  const document = useEditorStore((s) => s.document);
  const [buffer, setBuffer] = useState<Uint8Array<ArrayBufferLike> | null>(
    null,
  );
  useEffect(() => {
    // Use the arrayBuffer() method of the Blob API to get an ArrayBuffer
    (async function () {
      const arrayBuffer = await document?.blob.arrayBuffer();
      if (!arrayBuffer) return;

      // Create a Uint8Array view from the ArrayBuffer
      const uint8Array = new Uint8Array(arrayBuffer);

      setBuffer(uint8Array);
    })();
  }, [document?.blob]);

  if (!buffer) return null;

  return (
    <div className={cn(DocumentEditorVariants({ className }))}>
      <Whiteboard />
      <PDFRenderer />
    </div>
  );
}
