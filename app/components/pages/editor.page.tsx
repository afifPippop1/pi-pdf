import { PDFDocument } from "pdf-lib";
import { useState } from "react";
import FileUpload from "../molecules/FileUpload";
import PDFEditor from "../organisms/PdfEditor.client";

export default function EditorPage() {
  const [uploadedFile, setUploadedFile] = useState<File>();
  const [editableDoc, setEditableDoc] = useState<PDFDocument>();
  const [sourceDoc, setSourceDoc] = useState<PDFDocument>();
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer>();
  const [removedPages, setRemovedPages] = useState<Record<number, boolean>>({});

  function resetState() {
    setEditableDoc(undefined);
    setSourceDoc(undefined);
    setPdfBuffer(undefined);
    setRemovedPages({});
  }

  async function applyMergedPdf(doc: PDFDocument) {
    const editableCopy = await doc.copy();
    const savedBuffer = (await editableCopy.save()).buffer;
    setEditableDoc(editableCopy);
    setPdfBuffer(savedBuffer);
    setSourceDoc(doc);
  }

  async function mergeFilesIntoPdf(files: File[]) {
    let mergedDoc = await PDFDocument.create();

    if (sourceDoc) {
      const originalBuffer = (await sourceDoc.save()).buffer;
      mergedDoc = await PDFDocument.load(originalBuffer);
    }

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const loadedDoc = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedDoc.copyPages(
        loadedDoc,
        loadedDoc.getPageIndices()
      );
      copiedPages.forEach((page) => mergedDoc.addPage(page));
    }

    await applyMergedPdf(mergedDoc);
  }

  function toFileArray(fileList: FileList | null): File[] {
    return fileList ? Array.from(fileList) : [];
  }

  async function handleUpload(files: FileList | null) {
    const fileArray = toFileArray(files);
    setUploadedFile(fileArray[0]);
    await mergeFilesIntoPdf(fileArray);
  }

  async function handleAddFile(files: FileList | null) {
    resetState();
    await mergeFilesIntoPdf(toFileArray(files));
  }

  async function handleRemovePage(pageNum: number, pageIndex: number) {
    if (!sourceDoc) return;
    sourceDoc.removePage(pageIndex);
    setRemovedPages((prev) => ({ ...prev, [pageNum]: true }));
  }

  async function handleSave() {
    if (!sourceDoc) return;

    const pdfBytes = await sourceDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `edited-${uploadedFile?.name || "document"}`;
    link.click();

    setTimeout(() => URL.revokeObjectURL(link.href), 100);
  }

  if (!pdfBuffer || !uploadedFile || !editableDoc || !sourceDoc) {
    return (
      <div>
        <h3>Editor Page</h3>
        <FileUpload accept=".pdf" onChange={handleUpload} multiple />
      </div>
    );
  }

  return (
    <>
      <PDFEditor
        doc={editableDoc}
        buffer={pdfBuffer}
        onRemovePage={handleRemovePage}
        onSave={handleSave}
        onAdd={handleAddFile}
        fileName={uploadedFile.name}
        onStateSave={async (_buffer) => {}}
        removedPages={removedPages}
      />
    </>
  );
}
