import React, {
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { v4 as uuid } from "uuid";
import { actions, toolTypes } from "~/constants";
import { useDrag } from "~/hooks/useDrag";
import { canvas } from "~/lib/canvas";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  setElements,
  setToolType,
  updateElement as updateElementStore,
} from "~/store/slices/editorSlice";
import type { Element } from "~/types";
import type { Action } from "~/types/action";
import {
  adjustElementCoordinates,
  adjustmentRequired,
  createElement,
  drawElement,
  drawHighlight,
  getDocumentSize,
  isPointInElement,
  updateElement,
} from "~/utils";

export interface WhiteboardProps {
  scale: number;
}

export function Whiteboard({ scale }: WhiteboardProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activePageIndex = useAppSelector((s) => s.editor.activePageIndex);
  const pdfDoc = useAppSelector((s) => s.editor.pdfDoc);
  const toolType = useAppSelector((s) => s.editor.toolType);
  const elements = useAppSelector((s) => s.editor.elements);
  const docSize = getDocumentSize(pdfDoc, activePageIndex, scale);
  const [action, setAction] = useState<Action | null>(null);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const { dragOffset, setDragOffset, reset: resetDrag } = useDrag();

  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    const c = ref.current;
    const cvs = canvas(c);

    if (c) {
      const ctx = c.getContext("2d");
      ctx?.clearRect(0, 0, c.width, c.height);

      ctx?.save();
      ctx?.scale(scale, scale);

      elements.forEach((element) => {
        drawElement({ canvas: cvs, context: ctx, element });

        if (
          element.id === selectedElement?.id &&
          !!ctx &&
          action !== actions.DRAWING
        ) {
          drawHighlight(ctx, element);
        }
      });
      ctx?.restore();
    }
  }, [elements, selectedElement, action, scale]);

  function handleMouseDown(event: React.MouseEvent<HTMLCanvasElement>) {
    const { clientX, clientY } = event;
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (toolType) {
      canvas.style.cursor = "default";
    }

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

    if (!toolType && selectedElement) {
      setAction(actions.DRAGGING);
      canvas.style.cursor = "grab";

      const offsetX = x - selectedElement.x1;
      const offsetY = y - selectedElement.y1;

      setDragOffset({ x: offsetX, y: offsetY });
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
    resetDrag();
    dispatch(setToolType(null));
  }

  function handleMouseMove(event: React.MouseEvent<HTMLCanvasElement>) {
    const { clientX, clientY } = event;
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (action === actions.DRAWING) {
      if (!selectedElement) return;
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
    } else if (action === actions.DRAGGING) {
      if (!selectedElement) return;
      const index = elements.findIndex((el) => el.id === selectedElement.id);
      if (index === -1) return;

      const element = elements[index];
      const width = element.x2 - element.x1;
      const height = element.y2 - element.y1;

      const newX1 = x - dragOffset.x;
      const newY1 = y - dragOffset.y;
      const newX2 = newX1 + width;
      const newY2 = newY1 + height;

      updateElement(
        {
          ...element,
          x1: newX1,
          y1: newY1,
          x2: newX2,
          y2: newY2,
          index,
        },
        elements
      );
    } else {
      const isHovering = elements.some((el) => isPointInElement(x, y, el));
      canvas.style.cursor = isHovering ? "pointer" : "default";
    }
  }

  function handleClick(event: React.MouseEvent<HTMLCanvasElement>) {
    if (!action) {
      const { clientX, clientY } = event;
      const canvas = event.currentTarget;
      const rect = canvas.getBoundingClientRect();

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const coveringElements = elements.filter((el) =>
        isPointInElement(x, y, el)
      );
      if (coveringElements.length) {
        const lastElement = coveringElements[coveringElements.length - 1];
        setSelectedElement(lastElement);
        canvas.focus();
      } else {
        setSelectedElement(null);
      }
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLCanvasElement>) {
    if (["Backspace", "Delete"].includes(event.key) && selectedElement) {
      dispatch(
        setElements(
          elements.filter((element) => element.id !== selectedElement.id)
        )
      );
    }
  }

  return (
    <canvas
      ref={ref}
      className="absolute top-0 left-0 right-0 focus:outline-0"
      width={docSize.width}
      height={docSize.height}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    />
  );
}
