import { PDFDocument } from "pdf-lib";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setPDFDoc, setReadonlyDoc } from "~/store/slices/editorSlice";
import FileUpload from "../molecules/FileUpload";
import PDFEditor from "../organisms/PdfEditor.client";

export default function EditorPage() {
  const [uploadedFile, setUploadedFile] = useState<File>();
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer>();
  const [removedPages, setRemovedPages] = useState<Record<number, boolean>>({});
  const dispatch = useAppDispatch();
  const pdfDoc = useAppSelector((s) => s.editor.pdfDoc);
  const readonlyDoc = useAppSelector((s) => s.editor.pdfDoc);

  function resetState() {
    dispatch(setReadonlyDoc(null));
    dispatch(setPDFDoc(null));
    setPdfBuffer(undefined);
    setRemovedPages({});
  }

  async function applyMergedPdf(doc: PDFDocument) {
    const editableCopy = await doc.copy();
    const savedBuffer = (await editableCopy.save()).buffer;
    setPdfBuffer(savedBuffer);
    dispatch(setPDFDoc(doc));
    dispatch(setReadonlyDoc(doc));
  }

  async function mergeFilesIntoPdf(files: File[]) {
    let mergedDoc = await PDFDocument.create();

    if (pdfDoc) {
      const originalBuffer = (await pdfDoc.save()).buffer;
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
    if (!pdfDoc) return;
    pdfDoc.removePage(pageIndex);
    setRemovedPages((prev) => ({ ...prev, [pageNum]: true }));
  }

  async function handleSave() {
    if (!pdfDoc) return;

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `edited-${uploadedFile?.name || "document"}`;
    link.click();

    setTimeout(() => URL.revokeObjectURL(link.href), 100);
  }

  if (!pdfBuffer || !uploadedFile || !readonlyDoc || !pdfDoc) {
    return (
      <div>
        <h3>Editor Page</h3>
        <FileUpload accept=".pdf" onChange={handleUpload} multiple />
      </div>
    );
  }

  return (
    <PDFEditor
      doc={readonlyDoc}
      buffer={pdfBuffer}
      onRemovePage={handleRemovePage}
      onSave={handleSave}
      onAdd={handleAddFile}
      fileName={uploadedFile.name}
      onStateSave={async (_buffer) => {}}
      removedPages={removedPages}
    />
  );
}
