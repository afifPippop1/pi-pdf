import * as pdfjsLib from "pdfjs-dist";
import { useAppSelector } from "~/store/hooks";
import ContextMenu, {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ContextMenu";
import { ThumbnailItem } from "./ThumbnailItem.client";
import { useMemo } from "react";
import { useDocBuffer } from "~/hooks/useDocBuffer";
import { CiTrash } from "react-icons/ci";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface ThumbnailProps {
  onRemove: (index: number) => void;
}

export function Thumbnail(props: ThumbnailProps) {
  const pdfDoc = useAppSelector((s) => s.editor.pdfDoc);
  const { blob } = useDocBuffer();
  const loadingTask = useMemo(() => {
    if (!blob) return;
    return pdfjsLib.getDocument({ data: new Uint8Array(blob) });
  }, [blob]);

  if (!loadingTask) return null;

  return (
    <div className="flex flex-col items-center gap-2 p-4">
      {pdfDoc?.getPageIndices().map((index) => (
        <ThumbnailItem
          key={index}
          pageIndex={index}
          loadingTask={loadingTask}
          onRemove={props.onRemove}
        />
      ))}
    </div>
  );
}
