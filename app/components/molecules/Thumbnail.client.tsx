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
import * as pdfjsLib from "pdfjs-dist";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { reorderPage, setActivePageIndex } from "~/store/slices/editorSlice";
import { ThumbnailItem } from "./ThumbnailItem.client";

interface ThumbnailProps {
  buffer: Uint8Array;
  onRemove: (index: number) => void;
}

export function Thumbnail(props: ThumbnailProps) {
  const pdfDoc = useAppSelector((s) => s.editor.pdfDoc);
  const loadingTask = useMemo(() => {
    return pdfjsLib.getDocument({ data: new Uint8Array(props.buffer) });
  }, [props.buffer]);
  const items = pdfDoc?.getPageIndices() || [];
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const dispatch = useAppDispatch();

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
