import { PDFDocument } from "pdf-lib";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfViewerProps {
  doc?: PDFDocument;
}

export default function PdfViewer(props: PdfViewerProps) {
  const [buffer, setBuffer] = useState<ArrayBuffer>();

  useEffect(() => {
    (async function () {
      const chunk = await props.doc?.save();
      setBuffer(chunk?.buffer);
    })();
  }, []);

  if (!buffer) return <></>;
  return (
    <Document file={buffer} className="flex flex-col gap-8">
      {props.doc?.getPageIndices().map((page) => {
        const p = props.doc?.getPage(page);
        if (!p) return <></>;
        const { width, height } = p.getSize();
        return (
          <Page
            key={page}
            pageIndex={page}
            width={width}
            height={height}
            canvasBackground="transparent"
          />
        );
      })}
    </Document>
  );
}
