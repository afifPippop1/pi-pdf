import * as pdfjsLib from "pdfjs-dist";
import { Button } from "~/components/atoms/Button";
import { useAppSelector } from "~/store/hooks";
import { drawElementsOnPdfDoc, savePdfAsURL } from "~/utils";

export function SavePDFButton() {
  const pdfDoc = useAppSelector((s) => s.editor.pdfDoc);
  const elements = useAppSelector((s) => s.editor.elements);

  async function handleSave() {
    if (!pdfDoc) return;
    const buffer = await pdfDoc.save();
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
    const doc = await drawElementsOnPdfDoc(loadingTask, elements, pdfDoc);

    const url = await savePdfAsURL(doc);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Hello world.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();

    // Optional: revoke to free memory
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    // window.open(url);
  }

  return (
    <Button className="bg-grey-400 text-white rounded-lg" onClick={handleSave}>
      Save
    </Button>
  );
}
