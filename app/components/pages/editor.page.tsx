import { useState } from "react";
import FileUpload from "../atoms/file-upload.atom";
import { PDFDocument } from "pdf-lib";

export default function EditorPage() {
  const [file, setFile] = useState<File>();
  const [pdfDoc, setPdfDoc] = useState<PDFDocument>();

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
    setPdfDoc(pdfDoc);
  }

  async function removePage(page: number = 1) {
    if (!pdfDoc) return;
    const pageCountBefore = pdfDoc.getPageCount();
    pdfDoc?.removePage(page);
    const pageCountAfter = pdfDoc.getPageCount();
    console.log("Before: %d", pageCountBefore);
    console.log("After: %d", pageCountAfter);
    const modifiedPdfBytes = await pdfDoc.save();
    const newPdfDoc = await PDFDocument.load(modifiedPdfBytes);
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

  if (!file || !pdfDoc) {
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
      {/* Render page list */}
      <div>
        {pdfDoc.getPages().map((page, idx) => (
          <div key={idx}>{idx + 1}</div>
        ))}
      </div>

      <button onClick={() => removePage()}>Remove page 2</button>
      <button onClick={save}>Save</button>
    </div>
  );
}
