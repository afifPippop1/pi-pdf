import { PDFDocument } from "pdf-lib";
import { Page } from "react-pdf";

interface PdfViewerProps {
  doc?: PDFDocument;
}

export default function PDFPageViewer(props: PdfViewerProps) {
  return props.doc?.getPageIndices().map((page) => {
    const p = props.doc?.getPage(page);
    if (!p) return <></>;
    const { width, height } = p.getSize();
    return (
      <Page
        key={page}
        pageIndex={page}
        width={width}
        height={height}
        canvasBackground="#8f9e9a"
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    );
  });
}
