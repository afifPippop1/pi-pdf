import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type TouchEvent,
} from "react";
import { v4 as uuid } from "uuid";
import { actions, toolTypes } from "~/constants";
import { useDrag } from "~/hooks/useDrag";
import { useZoom } from "~/hooks/useZoom";
import { createCanvas } from "~/lib/canvas";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  setActivePageElements,
  setSelectedElement,
  setToolType,
  updateElement as updateElementStore,
} from "~/store/slices/editorSlice";
import type { Element, TextElement, TextProperties } from "~/types";
import type { Action } from "~/types/action";
import {
  adjustElementCoordinates,
  adjustmentRequired,
  CreateElement,
  drawElementOnCanvas,
  getDocumentSize,
  isPointInElement,
  isPointInText,
  isShapeElement,
  UpdateElement,
} from "~/utils";
import { TextEditor } from "./TextEditor";

export interface WhiteboardProps {}

export function Whiteboard(_: WhiteboardProps) {
  const { zoom } = useZoom();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const ref = useRef<HTMLCanvasElement>(null);
  const activePageIndex = useAppSelector((s) => s.editor.activePageIndex);
  const pdfDoc = useAppSelector((s) => s.editor.pdfDoc);
  const toolType = useAppSelector((s) => s.editor.toolType);
  const el = useAppSelector((s) => s.editor.elements);
  const docSize = getDocumentSize(pdfDoc, activePageIndex, zoom);
  const [action, setAction] = useState<Action | null>(null);
  const selectedElement = useAppSelector((s) => s.editor.selectedElement);
  const { dragOffset, setDragOffset, reset: resetDrag } = useDrag();
  const toolState = useAppSelector((s) => s.editor.toolState);
  const elements = useMemo(
    () => el[activePageIndex] || [],
    [el, activePageIndex]
  );
  const activeElementIndex = useMemo(
    () => elements.findIndex((element) => element.id === selectedElement?.id),
    [elements, activePageIndex]
  );

  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    const canvasElement = ref.current;
    const canvas = createCanvas(canvasElement);

    if (canvasElement) {
      drawElementOnCanvas(canvasElement, canvas, action, docSize, zoom);
    }
  }, [action, zoom, docSize]);

  useEffect(() => {
    if (action === actions.WRITING) {
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
  }, [action]);

  function handleMouseDown(event: {
    clientX: number;
    clientY: number;
    currentTarget: HTMLCanvasElement;
  }) {
    if (toolType && action === actions.WRITING) return;

    const { clientX, clientY } = event;
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    // Normalize coordinate
    const { x, y } = normalizeCoordinate({
      x: clientX,
      y: clientY,
      bounding: rect,
    });
    // const x = (clientX - rect.left) / zoom;
    // const y = (clientY - rect.top) / zoom;

    if (toolType) {
      canvas.style.cursor = "default";

      switch (toolType) {
        case toolTypes.RECTANGLE:
          setAction(actions.DRAWING);
          const element = CreateElement.rectangle({
            x1: x,
            y1: y,
            x2: x,
            y2: y,
            type: toolType,
            id: uuid(),
            options: toolState.RECTANGLE,
          });
          dispatch(setSelectedElement(element));
          dispatch(updateElementStore(element));
          break;
        case toolTypes.LINE: {
          setAction(actions.DRAWING);
          const element = CreateElement.line({
            x1: x,
            y1: y,
            x2: x,
            y2: y,
            type: toolType,
            id: uuid(),
          });
          dispatch(setSelectedElement(element));
          dispatch(updateElementStore(element));
          break;
        }
        case toolTypes.TEXT: {
          const element = CreateElement.text({
            x1: x,
            y1: y,
            text: "",
            type: toolType,
            id: uuid(),
            properties: toolState.TEXT as TextProperties,
          });
          dispatch(setSelectedElement(element));
          setAction(actions.WRITING);
          dispatch(updateElementStore(element));
        }
      }
    }

    if (!toolType && selectedElement) {
      if (
        isPointInElement({
          coordinate: { x, y },
          element: selectedElement,
          scale: zoom,
        }) ||
        (selectedElement.type === toolTypes.TEXT &&
          isPointInText(selectedElement, x, y, canvas.getContext("2d")!))
      ) {
        setAction(actions.DRAGGING);
        canvas.style.cursor = "grab";

        const offsetX = x - selectedElement.x1;
        const offsetY = y - selectedElement.y1;

        setDragOffset({ x: offsetX, y: offsetY });
      }
    }
  }

  function handleMouseUp() {
    const selectedElementIndex = elements.findIndex(
      (el) => el.id === selectedElement?.id
    );
    if (selectedElementIndex !== -1) {
      if (action === actions.DRAWING) {
        const element = elements[selectedElementIndex];
        if (isShapeElement(element)) {
          if (adjustmentRequired(element.type)) {
            const coordinates = adjustElementCoordinates(element);
            if (coordinates) {
              const { x1, x2, y1, y2 } = coordinates;
              const updateElement = UpdateElement.new(elements);
              updateElement.update({
                id: element.id,
                index: selectedElementIndex,
                type: element.type,
                x1,
                y1,
                x2,
                y2,
              });
            }
          }
        }
        reset();
      } else if (action === actions.DRAGGING) {
        reset();
      }
    }
  }

  function drawingElement({ x, y }: { x: number; y: number }) {
    if (!selectedElement) return;
    if (activeElementIndex !== -1) {
      const element = elements[activeElementIndex];
      if (isShapeElement(element)) {
        UpdateElement.new(elements).update({
          ...element,
          x2: x,
          y2: y,
          index: activeElementIndex,
        });
      }
    }
  }

  function draggingElement({ x, y }: { x: number; y: number }) {
    if (!selectedElement) return;
    const index = elements.findIndex((el) => el.id === selectedElement.id);
    if (index === -1) return;

    const element = elements[index];
    const updateElement = UpdateElement.new(elements);
    if (
      element.type === toolTypes.LINE ||
      element.type === toolTypes.RECTANGLE
    ) {
      const width = element.x2 - element.x1;
      const height = element.y2 - element.y1;

      const newX1 = x - dragOffset.x;
      const newY1 = y - dragOffset.y;
      const newX2 = newX1 + width;
      const newY2 = newY1 + height;

      if (element.type === toolTypes.RECTANGLE) {
        updateElement.rectangle({
          ...element,
          x1: newX1,
          y1: newY1,
          x2: newX2,
          y2: newY2,
          index,
          options: { color: element.element.color },
        });
      } else {
        updateElement.line({
          ...element,
          x1: newX1,
          y1: newY1,
          x2: newX2,
          y2: newY2,
          index,
        });
      }
    } else if (element.type === toolTypes.TEXT) {
      const newX1 = x - dragOffset.x;
      const newY1 = y - dragOffset.y;
      updateElement.text({
        ...element,
        type: toolTypes.TEXT,
        x1: newX1,
        y1: newY1,
        index,
      });
    }
  }

  function normalizeCoordinate({
    x,
    y,
    bounding,
  }: {
    x: number;
    y: number;
    bounding: DOMRect;
  }) {
    return {
      x: (x - bounding.left) / zoom,
      y: (y - bounding.top) / zoom,
    };
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
    });

    if (action === actions.DRAWING) {
      drawingElement(normalizedCoordinate);
    } else if (action === actions.DRAGGING) {
      draggingElement(normalizedCoordinate);
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
          const { x, y } = normalizeCoordinate({
            x: clientX,
            y: clientY,
            bounding: rect,
          });
          return isPointInText(el, x, y, canvas.getContext("2d")!);
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
        id: element.id,
        index: selectedElementIndex,
        type: toolTypes.TEXT,
        x1: element.x1,
        y1: element.y1,
        text,
        properties: element.properties,
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
