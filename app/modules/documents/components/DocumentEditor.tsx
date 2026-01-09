import * as pdfjsLib from "pdfjs-dist";
import { useEditorStore } from "~/modules/documents/stores/editorStore";
import { PdfViewer } from "./PDFViewer";
import { useEffect, useMemo, useState } from "react";
import PDFRenderer from "./PDFRenderer";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function DocumentEditor() {
  const document = useEditorStore((s) => s.document);
  const activePageIndex = useEditorStore((s) => s.activePageIndex);
  const [buffer, setBuffer] = useState<Uint8Array<ArrayBufferLike> | null>(
    null
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
    <div className="relative w-max">
      <PDFRenderer />
    </div>
  );
}
