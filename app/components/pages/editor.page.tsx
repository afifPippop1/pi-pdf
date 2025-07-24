import { PDFDocument } from "pdf-lib";
import { useMemo, useState } from "react";
import FileUpload from "../atoms/FileUpload";
import PDFEditor from "../organisms/PdfEditor.client";

export default function EditorPage() {
  const [file, setFile] = useState<File>();
  const [pdfDoc, setPdfDoc] = useState<PDFDocument>();
  const [buffer, setBuffer] = useState<ArrayBuffer>();

  async function onChange(files: FileList | null) {
    if (!files) return;
    const f: File[] = [];
    for (let file of files) {
      f.push(file);
    }

    setFile(f?.[0]);
    const pdfDoc = await PDFDocument.create();
    for (let file of f) {
      const arrayBuffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(arrayBuffer);
      const copiedPages = await pdfDoc.copyPages(doc, doc.getPageIndices());
      copiedPages.forEach((page) => pdfDoc.addPage(page));
    }
    setBuffer((await pdfDoc.save()).buffer);
    setPdfDoc(pdfDoc);
  }

  async function removePage(page: number = 1) {
    if (!pdfDoc) return;
    pdfDoc.removePage(page);
    const modifiedPdfBytes = await pdfDoc.save();
    const newPdfDoc = await PDFDocument.load(modifiedPdfBytes);
    setBuffer((await newPdfDoc.save()).buffer);
    setPdfDoc(newPdfDoc);
  }

  async function save() {
    if (!pdfDoc) return;
    const modifiedPdfBytes = await pdfDoc.save();
    const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `edited-${file?.name || "document"}`;
    downloadLink.click();

    // Optional: Revoke the object URL later to free memory
    setTimeout(() => URL.revokeObjectURL(downloadLink.href), 100);
  }

  if (!buffer || !file || !pdfDoc) {
    return (
      <div>
        <h3>Editor Page</h3>
        <FileUpload accept=".pdf" onChange={onChange} multiple />
      </div>
    );
  }

  return (
    <div>
      <div>{file.name}</div>

      <button onClick={save}>Save</button>
      <PDFEditor doc={pdfDoc} buffer={buffer} onRemovePage={removePage} />
    </div>
  );
}
