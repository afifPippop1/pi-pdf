import type { PDFPage } from "pdf-lib";
import { Page, Thumbnail } from "react-pdf";

interface ThumbnailPageProps {
  page: PDFPage;
  pageIndex: number;
}

const ThumbnailWidth = 100;

export default function ThumbnailPage({ page, pageIndex }: ThumbnailPageProps) {
  return <Thumbnail pageIndex={pageIndex} width={ThumbnailWidth} />;
}
