import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import type { PDFDocument } from "pdf-lib";
import { Document, pdfjs } from "react-pdf";
import PDFPageViewer from "../molecules/PdfViewer.client";
import PDFThumbnail from "../molecules/Thumbnail.client";
import FileUpload from "../molecules/FileUpload";
import { Button } from "../atoms/Button";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PDFEditorProps {
  doc?: PDFDocument;
  buffer?: ArrayBuffer;
  onRemovePage?: (page: number) => void;
  onSave?: () => void;
  onAdd?: (files: FileList | null) => void;
  fileName: string;
}

export default function PDFEditor(props: PDFEditorProps) {
  if (!props.buffer) return <></>;

  return (
    <div>
      {/* NAVBAR */}
      <div className="mb-4">
        <div>{props.fileName}</div>
        <div className="flex gap-4">
          <FileUpload accept=".pdf" onChange={props.onAdd} multiple>
            <Button>Add file</Button>
          </FileUpload>
          <Button onClick={props.onSave}>Save</Button>
        </div>
      </div>

      <Document file={props.buffer} className="flex gap-8">
        <PDFThumbnail doc={props.doc} onRemovePage={props.onRemovePage} />
        <div className="flex flex-col gap-8 overflow-auto">
          <PDFPageViewer doc={props.doc} />
        </div>
      </Document>
    </div>
  );
}
