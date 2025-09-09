import {
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type TouchEvent,
} from "react";
import { actions, toolTypes } from "~/constants";
import { useActivePageElements } from "~/hooks/useActivePageElements";
import { useDrag } from "~/hooks/useDrag";
import { useDrawElementsOnCanvas } from "~/hooks/useDrawElementsOnCanvas";
import { useZoom } from "~/hooks/useZoom";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  setActivePageElements,
  setSelectedElement,
  setToolType,
} from "~/store/slices/editorSlice";
import type { Element, TextElement } from "~/types";
import type { Action } from "~/types/action";
import {
  draggingElementOnWhiteboard,
  drawElementOnWhiteboard,
  finishDrawingOnWhiteboard,
  generateInitialElement,
  getActiveElementIndex,
  getDocumentSize,
  isPointInElement,
  isPointInText,
  normalizeCoordinate,
  UpdateElement,
} from "~/utils";
import { TextEditor } from "./TextEditor";

export function Whiteboard() {
  const { zoom } = useZoom();
  const [action, setAction] = useState<Action | null>(null);
  const ref = useRef<HTMLCanvasElement>(null);
  const pdfDoc = useAppSelector((s) => s.editor.pdfDoc);
  const toolType = useAppSelector((s) => s.editor.toolType);
  const selectedElement = useAppSelector((s) => s.editor.selectedElement);
  const docSize = getDocumentSize(pdfDoc, zoom);
  const { dragOffset, setDragOffset, reset: resetDrag } = useDrag();
  const elements = useActivePageElements();

  const dispatch = useAppDispatch();

  useDrawElementsOnCanvas({ ref, action, docSize, zoom });

  function handleMouseDown(event: {
    clientX: number;
    clientY: number;
    currentTarget: HTMLCanvasElement;
  }) {
    if (toolType && action === actions.WRITING) return;

    const { clientX, clientY } = event;
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const normalizedCoordinate = normalizeCoordinate({
      x: clientX,
      y: clientY,
      bounding: rect,
      zoom,
    });

    if (toolType) {
      canvas.style.cursor = "default";
      generateInitialElement({
        canvas,
        coordinate: normalizedCoordinate,
        setAction,
      });
    }

    if (!toolType && selectedElement) {
      if (
        isPointInElement({
          coordinate: normalizedCoordinate,
          element: selectedElement,
          scale: zoom,
        }) ||
        (selectedElement.type === toolTypes.TEXT &&
          isPointInText(
            selectedElement,
            normalizedCoordinate,
            canvas.getContext("2d")!
          ))
      ) {
        setAction(actions.DRAGGING);
        canvas.style.cursor = "grab";

        const offsetX = normalizedCoordinate.x - selectedElement.x1;
        const offsetY = normalizedCoordinate.y - selectedElement.y1;

        setDragOffset({ x: offsetX, y: offsetY });
      }
    }
  }

  function handleMouseUp() {
    const selectedElementIndex = getActiveElementIndex();
    if (selectedElementIndex !== -1) {
      if (action === actions.DRAWING) {
        finishDrawingOnWhiteboard();
        reset();
      } else if (action === actions.DRAGGING) {
        reset();
      }
    }
  }

  function handleMouseMove(event: {
    clientX: number;
    clientY: number;
    currentTarget: HTMLCanvasElement;
  }) {
    const { clientX, clientY } = event;
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();

    const normalizedCoordinate = normalizeCoordinate({
      x: clientX,
      y: clientY,
      bounding: rect,
      zoom,
    });

    if (action === actions.DRAWING) {
      drawElementOnWhiteboard(normalizedCoordinate);
    } else if (action === actions.DRAGGING) {
      draggingElementOnWhiteboard({
        coordinate: normalizedCoordinate,
        dragOffset,
      });
    } else if (toolType === toolTypes.TEXT) {
      canvas.style.cursor = "text ";
    } else if (!toolType) {
      const isHovering = elements.some((el) =>
        isPointInElement({
          coordinate: normalizedCoordinate,
          element: el,
          scale: zoom,
        })
      );
      canvas.style.cursor = isHovering ? "pointer" : "default";
    }
  }

  function handleClick(event: {
    clientX: number;
    clientY: number;
    currentTarget: HTMLCanvasElement;
  }) {
    if (!action) {
      const { clientX, clientY } = event;
      const canvas = event.currentTarget;
      const rect = canvas.getBoundingClientRect();

      const coveringElements = elements.filter((el) => {
        if (el.type === toolTypes.TEXT) {
          const coordinate = normalizeCoordinate({
            x: clientX,
            y: clientY,
            bounding: rect,
            zoom,
          });
          return isPointInText(el, coordinate, canvas.getContext("2d")!);
        }
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        return isPointInElement({
          coordinate: { x, y },
          element: el,
          scale: zoom,
        });
      });
      if (coveringElements.length) {
        const lastElement = coveringElements[coveringElements.length - 1];
        dispatch(setSelectedElement(lastElement));
        canvas.focus();
      } else {
        dispatch(setSelectedElement(null));
      }
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLCanvasElement>) {
    if (["Backspace", "Delete"].includes(event.key) && selectedElement) {
      dispatch(
        setActivePageElements(
          elements.filter((element) => element.id !== selectedElement.id)
        )
      );
      reset();
    }
  }

  function reset() {
    setAction(null);
    dispatch(setSelectedElement(null));
    resetDrag();
    dispatch(setToolType(null));
  }

  function handleTextareaBlur(event: FocusEvent<HTMLTextAreaElement>) {
    const text = event.target.value;
    const selectedElementIndex = elements.findIndex(
      (el) => el.id === selectedElement?.id
    );
    if (selectedElementIndex !== -1) {
      const element = elements[selectedElementIndex] as Element<TextElement>;
      UpdateElement.new(elements).text({
        ...element,
        index: selectedElementIndex,
        text,
      });
    }
    reset();
  }

  function handleMouseEvent(
    fn: (prop: {
      clientX: number;
      clientY: number;
      currentTarget: HTMLCanvasElement;
    }) => void
  ) {
    return function (event: MouseEvent<HTMLCanvasElement>) {
      fn(event);
    };
  }

  function handleTouchEvent(
    fn: (prop: {
      clientX: number;
      clientY: number;
      currentTarget: HTMLCanvasElement;
    }) => void
  ) {
    return function (event: TouchEvent<HTMLCanvasElement>) {
      const touch = event.touches[0];
      fn({
        clientX: touch.clientX,
        clientY: touch.clientY,
        currentTarget: event.currentTarget,
      });
    };
  }

  return (
    <>
      <TextEditor action={action} onBlur={handleTextareaBlur} />
      <canvas
        ref={ref}
        className="absolute top-0 left-0 right-0 focus:outline-0"
        style={{
          touchAction: toolType || selectedElement ? "none" : "auto",
        }}
        width={docSize.width}
        height={docSize.height}
        onMouseDown={handleMouseEvent(handleMouseDown)}
        onMouseUp={handleMouseEvent(handleMouseUp)}
        onMouseMove={handleMouseEvent(handleMouseMove)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchEvent(handleMouseDown)}
        tabIndex={0}
        onTouchMove={handleTouchEvent(handleMouseMove)}
        onTouchEnd={handleMouseUp}
      />
    </>
  );
}
