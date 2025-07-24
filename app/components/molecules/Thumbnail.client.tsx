import { PDFDocument } from "pdf-lib";
import { useEffect, useState } from "react";
import ThumbnailPage from "../atoms/ThumbnailPage";
import ContextMenu, { type Option } from "./ContextMenu";

interface PDFThumbnailProps {
  doc?: PDFDocument;
  onRemovePage?: (page: number) => void;
}

export default function PDFThumbnail(props: PDFThumbnailProps) {
  const [buffer, setBuffer] = useState<ArrayBuffer>();

  useEffect(() => {
    (async function () {
      const chunk = await props.doc?.save();
      setBuffer(chunk?.buffer);
    })();
  }, [props.doc]);

  if (!buffer) return <></>;

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
            options={options}
            onChange={(option) => props.onRemovePage?.(option.value as number)}
          >
            <ThumbnailPage key={pageIndex} pageIndex={pageIndex} page={page} />
          </ContextMenu>
        );
      })}
    </div>
  );
}
