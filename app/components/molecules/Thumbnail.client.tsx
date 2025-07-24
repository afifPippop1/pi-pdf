import { PDFDocument } from "pdf-lib";
import ThumbnailPage from "../atoms/ThumbnailPage";
import ContextMenu, { type Option } from "./ContextMenu";

interface PDFThumbnailProps {
  doc?: PDFDocument;
  onRemovePage?: (page: number) => void;
}

export default function PDFThumbnail(props: PDFThumbnailProps) {
  return (
    <div className="flex flex-col gap-4">
      {props.doc?.getPageIndices().map((pageIndex) => {
        const page = props.doc?.getPage(pageIndex);
        const options: Option[] = [
          {
            label: "Remove",
            value: pageIndex,
          },
        ];
        if (!page) return <></>;
        return (
          <ContextMenu
            key={pageIndex}
            options={options}
            onChange={(option) => props.onRemovePage?.(option.value as number)}
          >
            <ThumbnailPage pageIndex={pageIndex} page={page} />
          </ContextMenu>
        );
      })}
    </div>
  );
}
