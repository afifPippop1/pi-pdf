import { useLayoutEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { actions, toolTypes } from "~/constants";
import { canvas } from "~/lib/canvas";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { updateElement as updateElementStore } from "~/store/slices/editorSlice";
import type { Element } from "~/types";
import type { Action } from "~/types/action";
import {
  adjustElementCoordinates,
  adjustmentRequired,
  createElement,
  drawElement,
  getDocumentSize,
  updateElement,
} from "~/utils";

export interface WhiteboardProps {}

export function Whiteboard(props: WhiteboardProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activePageIndex = useAppSelector((s) => s.editor.activePageIndex);
  const pdfDoc = useAppSelector((s) => s.editor.pdfDoc);
  const toolType = useAppSelector((s) => s.editor.toolType);
  const elements = useAppSelector((s) => s.editor.elements);
  const docSize = getDocumentSize(pdfDoc, activePageIndex);
  const [action, setAction] = useState<Action | null>(null);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    const c = ref.current;
    const cvs = canvas(c);

    if (c) {
      const ctx = c.getContext("2d");
      ctx?.clearRect(0, 0, c.width, c.height);

      elements.forEach((element) => {
        drawElement({ canvas: cvs, context: ctx, element });
      });
    }
  }, [elements]);

  function handleMouseDown(event: React.MouseEvent<HTMLCanvasElement>) {
    const { clientX, clientY } = event;
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (toolType === toolTypes.RECTANGLE) {
      setAction(actions.DRAWING);
      const element = createElement({
        x1: x,
        y1: y,
        x2: x,
        y2: y,
        type: toolType,
        id: uuid(),
      });
      setSelectedElement(element);
      dispatch(updateElementStore(element));
    }
  }

  function handleMouseUp(event: React.MouseEvent<HTMLCanvasElement>) {
    const selectedElementIndex = elements.findIndex(
      (el) => el.id === selectedElement?.id
    );
    if (selectedElementIndex !== -1) {
      if (action === actions.DRAWING) {
        const element = elements[selectedElementIndex];
        if (adjustmentRequired(element.type)) {
          const coordinates = adjustElementCoordinates(element);
          if (coordinates) {
            const { x1, x2, y1, y2 } = coordinates;
            updateElement(
              {
                id: element.id,
                index: selectedElementIndex,
                type: element.type,
                x1,
                x2,
                y1,
                y2,
              },
              elements
            );
          }
        }
      }
    }

    setAction(null);
    setSelectedElement(null);
  }

  function handleMouseMove(event: React.MouseEvent<HTMLCanvasElement>) {
    if (!selectedElement) return;
    const { clientX, clientY } = event;
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (action === actions.DRAWING) {
      const index = elements.findIndex(
        (element) => element.id === selectedElement?.id
      );
      if (index !== -1) {
        const element = elements[index];
        updateElement(
          {
            ...element,
            x2: x,
            y2: y,
            index,
          },
          elements
        );
      }
    }
  }

  return (
    <canvas
      ref={ref}
      className="absolute top-0 left-0 right-0"
      width={docSize.width}
      height={docSize.height}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    />
  );
}
