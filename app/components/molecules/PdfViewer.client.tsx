import { PDFDocument } from "pdf-lib";
import { useMemo } from "react";
import { Page } from "react-pdf";
import { useAppSelector } from "~/store/hooks";

interface PdfViewerProps {
  doc?: PDFDocument;
  removedPages: Record<number, boolean>;
}

export default function PDFPageViewer(props: PdfViewerProps) {
  const pdfDoc = useAppSelector((s) => s.editor.pdfDoc);
  const activePageIndex = useAppSelector((s) => s.editor.activePageIndex);
  if (!pdfDoc) return null;
  return <PageItem pageIndex={activePageIndex} doc={pdfDoc} />;
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
