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
    window.open(url);
  }

  return (
    <Button className="bg-grey-400 text-white rounded-lg" onClick={handleSave}>
      Save
    </Button>
  );
}
