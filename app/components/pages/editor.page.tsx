import { PDFDocument } from "pdf-lib";
import { useState } from "react";
import FileUpload from "../molecules/FileUpload";
import PDFEditor from "../organisms/PdfEditor.client";

// TODO
// The shape or addition should only be add to canvas first
// When user save later it will be really applied to the PDF Document

export default function EditorPage() {
  const [file, setFile] = useState<File>();
  const [mainDoc, setMainDoc] = useState<PDFDocument>();
  const [pdfDoc, setPdfDoc] = useState<PDFDocument>();
  const [buffer, setBuffer] = useState<ArrayBuffer>();
  const [removedPages, setRemovedPages] = useState<Record<number, boolean>>({});

  function reset() {
    setMainDoc(undefined);
    setBuffer(undefined);
    setPdfDoc(undefined);
    setRemovedPages({});
  }

  async function setDoc(doc: PDFDocument) {
    const copy = await doc.copy();
    setMainDoc(copy);
    setBuffer((await copy.save()).buffer);
    setPdfDoc(doc);
  }

  async function mergePDF(files: File[]) {
    let newDoc = await PDFDocument.create();
    if (pdfDoc) {
      const buff = (await pdfDoc.save()).buffer;
      newDoc = await PDFDocument.load(buff);
    }
    for (let file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(arrayBuffer);
      const copiedPages = await newDoc.copyPages(doc, doc.getPageIndices());
      copiedPages.forEach((page) => newDoc.addPage(page));
    }
    setDoc(newDoc);
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

  async function removePage(page: number, index: number) {
    if (!pdfDoc) return;
    pdfDoc.removePage(index);
    await pdfDoc.save();
    setRemovedPages((pages) => ({ ...pages, [page]: true }));
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
    reset();
    await mergePDF(getFiles(files));
  }

  if (!buffer || !file || !pdfDoc || !mainDoc) {
    return (
      <div>
        <h3>Editor Page</h3>
        <FileUpload accept=".pdf" onChange={onChange} multiple />
      </div>
    );
  }

  return (
    <PDFEditor
      doc={mainDoc}
      buffer={buffer}
      onRemovePage={removePage}
      onSave={save}
      onAdd={addFile}
      fileName={file.name}
      onStateSave={async (buffer) => {
        // const newDoc = await PDFDocument.load(buffer);
        // setBuffer(buffer);
        // setPdfDoc(newDoc);
      }}
      removedPages={removedPages}
    />
  );
}
