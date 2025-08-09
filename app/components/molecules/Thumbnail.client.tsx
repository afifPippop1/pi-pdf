import * as pdfjsLib from "pdfjs-dist";
import { useMemo } from "react";
import { useDocBuffer } from "~/hooks/useDocBuffer";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { ThumbnailItem } from "./ThumbnailItem.client";
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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { reorderPage } from "~/store/slices/editorSlice";

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
  const items = useMemo(() => pdfDoc?.getPageIndices() || [], [pdfDoc]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const dispatch = useAppDispatch();

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    console.log(active, over);
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
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col items-center gap-2 p-4">
          {items.map((index) => (
            <ThumbnailItem
              key={index}
              pageIndex={index}
              loadingTask={loadingTask}
              onRemove={props.onRemove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
