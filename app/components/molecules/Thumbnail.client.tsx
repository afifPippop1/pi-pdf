import { PDFDocument } from "pdf-lib";
import { useEffect, useState } from "react";
import ThumbnailPage from "./ThumbnailPage";

interface PDFThumbnailProps {
  doc?: PDFDocument;
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
        if (!page) return <></>;
        return (
          <ThumbnailPage key={pageIndex} pageIndex={pageIndex} page={page} />
        );
      })}
    </div>
  );
}
