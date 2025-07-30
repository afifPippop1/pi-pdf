import type { PDFPage } from "pdf-lib";
import { Page, Thumbnail } from "react-pdf";
import type { OnItemClickArgs } from "react-pdf/dist/shared/types.js";

interface ThumbnailPageProps {
  page: PDFPage;
  pageIndex: number;
  onItemClick?: ((args: OnItemClickArgs) => void) | undefined;
}

const ThumbnailWidth = 100;

export default function ThumbnailPage({
  page,
  pageIndex,
  onItemClick,
}: ThumbnailPageProps) {
  return (
    <Thumbnail
      pageIndex={pageIndex}
      width={ThumbnailWidth}
      onItemClick={onItemClick}
    />
  );
}
