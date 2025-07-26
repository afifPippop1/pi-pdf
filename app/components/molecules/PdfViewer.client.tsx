import { PDFDocument } from "pdf-lib";
import { useMemo } from "react";
import { Page } from "react-pdf";

interface PdfViewerProps {
  doc?: PDFDocument;
  removedPages: Record<number, boolean>;
}

export default function PDFPageViewer(props: PdfViewerProps) {
  return props.doc
    ?.getPageIndices()
    .filter((pageIndex) => !(pageIndex in props.removedPages))
    .map((pageIndex) => (
      <PageItem key={pageIndex} pageIndex={pageIndex} doc={props.doc} />
    ));
}

interface PageItemProps extends Omit<PdfViewerProps, "removedPages"> {
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
      renderTextLayer={false}
      renderAnnotationLayer={false}
    />
  );
}
