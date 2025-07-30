import { PDFDocument } from "pdf-lib";
import { useAppDispatch } from "~/store/hooks";
import { setActivePageIndex } from "~/store/slices/editorSlice";
import ThumbnailPage from "../atoms/ThumbnailPage";
import ContextMenu, { type Option } from "./ContextMenu";

interface PDFThumbnailProps {
  doc: PDFDocument;
  onRemovePage?: (page: number, index: number) => void;
  removedPages: Record<number, boolean>;
}

export default function PDFThumbnail(props: PDFThumbnailProps) {
  const dispatch = useAppDispatch();
  return (
    <div className="flex gap-4">
      {props.doc
        .getPageIndices()
        .filter((pageIndex) => !(pageIndex in props.removedPages))
        .map((pageIndex, index) => {
          const page = props.doc.getPage(pageIndex);
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
              onChange={(option) =>
                props.onRemovePage?.(option.value as number, index)
              }
            >
              <ThumbnailPage
                pageIndex={pageIndex}
                page={page}
                onItemClick={({ pageIndex }) => {
                  dispatch(setActivePageIndex(pageIndex));
                }}
              />
            </ContextMenu>
          );
        })}
    </div>
  );
}
