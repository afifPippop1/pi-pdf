import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PDFDocument } from "pdf-lib";
import { useEffect, useRef, useState } from "react";
import { useMobile } from "~/hooks/useMobile";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { reorderPage, setActivePageIndex } from "~/store/slices/editorSlice";
import { getPdfPageThumbnail } from "~/utils/getPdfThumbnail.client";
import { ThumbnailItem } from "./ThumbnailItem.client";

interface ThumbnailProps {
  buffer: Uint8Array;
  onRemove: (index: number) => void;
}

export function Thumbnail(props: ThumbnailProps) {
  const pdfDoc = useAppSelector((s) => s.editor.pdfDoc);
  const loadingTask = useAppSelector((s) => s.editor.loadingTask);
  const items = pdfDoc?.getPageIndices() || [];
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const dispatch = useAppDispatch();
  const pdfDocRef = useRef<PDFDocument | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const { isMobile } = useMobile();
  const thumbnailScale = isMobile ? 0.1 : 0.2;

  useEffect(() => {
    (async () => {
      if (!loadingTask) return;
      const pdfDoc = await PDFDocument.load(props.buffer);
      pdfDocRef.current = pdfDoc;

      const thumbs: string[] = [];
      for (let i = 1; i <= pdfDoc.getPageCount(); i++) {
        thumbs.push(await getPdfPageThumbnail(loadingTask, i, thumbnailScale));
      }
      setThumbnails(thumbs);
    })();
  }, [props.buffer, thumbnailScale]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id === over?.id) {
      dispatch(setActivePageIndex(active.id as number));
      return;
    }
    dispatch(
      reorderPage({ active: active.id as number, over: over?.id as number })
    );
  }

  if (!loadingTask) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items}
        strategy={
          isMobile ? horizontalListSortingStrategy : verticalListSortingStrategy
        }
      >
        <div className="flex md:flex-col items-center gap-2 p-4">
          {items.map((index) => (
            <ThumbnailItem
              key={index}
              pageIndex={index}
              thumbnail={thumbnails[index]}
              onRemove={props.onRemove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
