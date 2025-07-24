import type { PDFPage } from "pdf-lib";
import { Page, Thumbnail } from "react-pdf";

interface ThumbnailPageProps {
  page: PDFPage;
  pageIndex: number;
}

const ThumbnailWidth = 20;
const ThumbnailHeight = 20;

export default function ThumbnailPage({ page, pageIndex }: ThumbnailPageProps) {
  return (
    <Thumbnail pageIndex={pageIndex} width={100} canvasBackground="#8f9e9a" />
  );
}
