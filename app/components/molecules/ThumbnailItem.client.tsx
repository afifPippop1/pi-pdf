import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import * as pdfjsLib from "pdfjs-dist";
import { useLayoutEffect, useRef } from "react";
import { CiTrash } from "react-icons/ci";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { getPageFromIndex } from "~/utils";
import ContextMenu, {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ContextMenu";
import clsx from "clsx";

interface ThumbnailItemProps {
  pageIndex: number;
  thumbnail: string;
  onRemove: (index: number) => void;
}

export function ThumbnailItem({
  pageIndex,
  thumbnail,
  onRemove,
}: ThumbnailItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: pageIndex });
  const activePageIndex = useAppSelector((s) => s.editor.activePageIndex);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
          <img
            src={thumbnail}
            className={clsx(
              "cursor-pointer outline-gray-300",
              activePageIndex === pageIndex ? "outline-2" : "hover:outline-2"
            )}
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
