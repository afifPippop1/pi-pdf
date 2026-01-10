import { useLayoutEffect, type ReactNode } from "react";
import { useEditorStore } from "~/modules/documents/stores/editorStore";
import { usePdfStore } from "~/modules/documents/stores/pdfStore";
import { blobToUint8Array } from "../utils/blobToUint8Array";

export default function PdfProvider({ children }: { children: ReactNode }) {
  const document = useEditorStore((s) => s.document);
  const setBuffer = usePdfStore((s) => s.setBuffer);

  useLayoutEffect(() => {
    if (!document) return;
    (async function () {
      console.log("loading document...");
      const buffer = await blobToUint8Array(document.blob);
      await setBuffer(buffer);
      console.log("Document loaded");
    })();
  }, [document]);

  return children;
}
