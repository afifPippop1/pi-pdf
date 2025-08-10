import * as pdfjsLib from "pdfjs-dist";
import { Button } from "~/components/atoms/Button";
import { useAppSelector } from "~/store/hooks";
import { drawElementsOnPdfDoc, savePdfAsURL } from "~/utils";

export function SavePDFButton() {
  const pdfDoc = useAppSelector((s) => s.editor.pdfDoc);
  const elements = useAppSelector((s) => s.editor.elements);
  const loadingTask = useAppSelector((s) => s.editor.loadingTask);

  async function handleSave() {
    if (!loadingTask || !pdfDoc) return;
    const doc = await drawElementsOnPdfDoc(loadingTask, elements, pdfDoc);

    const url = await savePdfAsURL(doc);
    // window.open(url);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Hello world.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();

    // Optional: revoke to free memory
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <Button className="bg-grey-400 text-white rounded-lg" onClick={handleSave}>
      Save
    </Button>
  );
}
