import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  buffer?: ArrayBuffer;
}

export default function PdfViewer(props: PdfViewerProps) {
  if (!props.buffer) return <></>;
  return (
    <Document file={props.buffer}>
      <Page pageNumber={1} />
    </Document>
  );
}
