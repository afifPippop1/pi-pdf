import { bytesFor, PDFDocument } from "pdf-lib";
import { useMemo, useState } from "react";
import FileUpload from "../molecules/FileUpload";
import PDFEditor from "../organisms/PdfEditor.client";
import { Button } from "../atoms/Button";

export default function EditorPage() {
  const [file, setFile] = useState<File>();
  const [pdfDoc, setPdfDoc] = useState<PDFDocument>();
  const [buffer, setBuffer] = useState<ArrayBuffer>();

  async function mergePDF(files: File[]) {
    const newDoc = await PDFDocument.create();
    if (pdfDoc) {
      const copiedPages = await newDoc.copyPages(
        pdfDoc,
        pdfDoc.getPageIndices()
      );
      copiedPages.forEach((page) => newDoc.addPage(page));
    }
    for (let file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(arrayBuffer);
      const copiedPages = await newDoc.copyPages(doc, doc.getPageIndices());
      copiedPages.forEach((page) => newDoc.addPage(page));
    }
    setBuffer((await newDoc.save()).buffer);
    setPdfDoc(newDoc);
  }

  function getFiles(files: FileList | null): File[] {
    const f: File[] = [];
    if (files) {
      for (let file of files) {
        f.push(file);
      }
    }
    return f;
  }

  async function onChange(files: FileList | null) {
    const f = getFiles(files);

    setFile(f?.[0]);
    await mergePDF(f);
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

  async function addFile(files: FileList | null) {
    await mergePDF(getFiles(files));
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
      <div className="mb-4">
        <div>{file.name}</div>
        <div className="flex gap-4">
          <FileUpload accept=".pdf" onChange={addFile} multiple>
            <Button>Add file</Button>
          </FileUpload>
          <Button onClick={save}>Save</Button>
        </div>
      </div>
      <PDFEditor doc={pdfDoc} buffer={buffer} onRemovePage={removePage} />
    </div>
  );
}
