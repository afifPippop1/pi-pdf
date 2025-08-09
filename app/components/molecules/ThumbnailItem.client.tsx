import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import * as pdfjsLib from "pdfjs-dist";
import { useLayoutEffect, useRef } from "react";
import { CiTrash } from "react-icons/ci";
import { useAppDispatch } from "~/store/hooks";
import { getPageFromIndex } from "~/utils";
import ContextMenu, {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ContextMenu";

interface ThumbnailItemProps {
  pageIndex: number;
  loadingTask: pdfjsLib.PDFDocumentLoadingTask;
  onRemove: (index: number) => void;
}

export function ThumbnailItem({
  pageIndex,
  loadingTask,
  onRemove,
}: ThumbnailItemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);
  const dispatch = useAppDispatch();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: pageIndex });

  useLayoutEffect(() => {
    loadingTask.promise.then((pdf) => {
      pdf.getPage(getPageFromIndex(pageIndex)).then((page) => {
        const viewport = page.getViewport({ scale: 0.2 });
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Cancel any ongoing render before starting a new one
        renderTaskRef.current?.cancel();

        const renderTask = page.render({
          canvasContext: context!,
          viewport,
          canvas,
        });

        renderTaskRef.current = renderTask;

        renderTask.promise.catch((err) => {
          if (err?.name !== "RenderingCancelledException") {
            console.error("Render error:", err);
          }
        });
      });
    });

    // Optional: cancel render task if component unmounts
    return () => {
      renderTaskRef.current?.cancel();
    };
  }, [pageIndex, loadingTask]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
          <canvas
            ref={canvasRef}
            className="cursor-pointer hover:outline-2 hover:outline-grey-400"
          />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={async () => {
            onRemove(pageIndex);
          }}
          className="text-red-500"
        >
          <CiTrash /> Remove
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
