import { PDFDocument } from "pdf-lib";
import { useMemo } from "react";
import { Page } from "react-pdf";

interface PdfViewerProps {
  doc?: PDFDocument;
}

export default function PDFPageViewer(props: PdfViewerProps) {
  return props.doc
    ?.getPageIndices()
    .map((pageIndex) => <PageItem pageIndex={pageIndex} doc={props.doc} />);
}

interface PageItemProps extends PdfViewerProps {
  pageIndex: number;
}

function PageItem({ doc, pageIndex }: PageItemProps) {
  const p = useMemo(() => doc?.getPage(pageIndex), []);
  if (!p) return <></>;
  const { width, height } = p.getSize();
  return (
    <Page
      key={pageIndex}
      pageIndex={pageIndex}
      width={width}
      height={height}
      canvasBackground="#8f9e9a"
      renderTextLayer={false}
      renderAnnotationLayer={false}
    />
  );
}
