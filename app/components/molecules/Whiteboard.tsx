import {
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type TouchEvent,
} from "react";
import { actions, scalingActions, toolTypes } from "~/constants";
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
  isOnHighlight,
  isPointInElement,
  isPointInText,
  isShapeElement,
  normalizeCoordinate,
  ScaleElementOnWhiteboard,
  setCanvasCursor,
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
      const onHighlight = isOnHighlight({
        element: selectedElement,
        coordinate: normalizedCoordinate,
        context: canvas.getContext("2d"),
      });
      if (onHighlight.on) {
        if (onHighlight.onTopRight) {
          setAction(actions.SCALING_TOP_RIGHT);
        } else if (onHighlight.onTopLeft) {
          setAction(actions.SCALING_TOP_LEFT);
        } else if (onHighlight.onBottomRight) {
          setAction(actions.SCALING_BOTTOM_RIGHT);
        } else if (onHighlight.onBottomLeft) {
          setAction(actions.SCALING_BOTTOM_LEFT);
        } else if (onHighlight.onTop) {
          setAction(actions.SCALING_TOP);
        } else if (onHighlight.onBottom) {
          setAction(actions.SCALING_BOTTOM);
        } else if (onHighlight.onLeft) {
          setAction(actions.SCALING_LEFT);
        } else if (onHighlight.onRight) {
          setAction(actions.SCALING_RIGHT);
        }
      } else if (
        isPointInElement({
          coordinate: normalizedCoordinate,
          element: selectedElement,
          scale: zoom,
        }) ||
        isPointInText(
          selectedElement,
          normalizedCoordinate,
          canvas.getContext("2d")!
        )
      ) {
        setAction(actions.DRAGGING);

        const offsetX = normalizedCoordinate.x - selectedElement.x1;
        const offsetY = normalizedCoordinate.y - selectedElement.y1;

        setDragOffset({ x: offsetX, y: offsetY });
      }
    }
  }

  function handleMouseUp() {
    const selectedElementIndex = getActiveElementIndex();
    if (selectedElementIndex !== -1) {
      if (action === actions.DRAWING || scalingActions.has(action)) {
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
      drawElementOnWhiteboard({
        x2: normalizedCoordinate.x,
        y2: normalizedCoordinate.y,
      });
    } else if (action === actions.DRAGGING) {
      draggingElementOnWhiteboard({
        coordinate: normalizedCoordinate,
        dragOffset,
      });
    } else if (scalingActions.has(action)) {
      if (selectedElement && isShapeElement(selectedElement)) {
        switch (action) {
          case actions.SCALING_BOTTOM_RIGHT:
            ScaleElementOnWhiteboard.bottomRight(normalizedCoordinate);
            break;
          case actions.SCALING_TOP_LEFT:
            ScaleElementOnWhiteboard.topLeft(normalizedCoordinate);
            break;
          case actions.SCALING_TOP_RIGHT:
            ScaleElementOnWhiteboard.topRight(normalizedCoordinate);
            break;
          case actions.SCALING_BOTTOM_LEFT:
            ScaleElementOnWhiteboard.bottomLeft(normalizedCoordinate);
            break;
          case actions.SCALING_TOP:
            ScaleElementOnWhiteboard.top(normalizedCoordinate);
            break;
          case actions.SCALING_LEFT:
            ScaleElementOnWhiteboard.left(normalizedCoordinate);
            break;
          case actions.SCALING_RIGHT:
            ScaleElementOnWhiteboard.right(normalizedCoordinate);
            break;
          case actions.SCALING_BOTTOM:
            ScaleElementOnWhiteboard.bottom(normalizedCoordinate);
            break;
        }
      } else if (selectedElement && selectedElement.type === toolTypes.TEXT) {
        const width =
          canvas.getContext("2d")?.measureText(selectedElement.text).width || 0;
        const height = selectedElement.properties.fontSize;

        // pick horizontal or vertical scale factor depending on action
        let scaleFactor = 1;
        if (
          action === actions.SCALING_LEFT ||
          action === actions.SCALING_RIGHT ||
          action === actions.SCALING_TOP_LEFT ||
          action === actions.SCALING_BOTTOM_RIGHT ||
          action === actions.SCALING_TOP_RIGHT ||
          action === actions.SCALING_BOTTOM_LEFT
        ) {
          scaleFactor = (normalizedCoordinate.x - selectedElement.x1) / width;
        } else {
          scaleFactor = (normalizedCoordinate.y - selectedElement.y1) / height;
        }

        const newFontSize = Math.max(
          4,
          selectedElement.properties.fontSize * scaleFactor
        );
        UpdateElement.new(elements).text({
          ...selectedElement,
          index: getActiveElementIndex(),
          properties: {
            ...selectedElement.properties,
            fontSize: newFontSize,
          },
        });
      }
    } else if (toolType === toolTypes.TEXT) {
      canvas.style.cursor = "text ";
    } else if (!toolType) {
      setCanvasCursor({ canvas, coordinate: normalizedCoordinate, zoom });
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
        canvas.style.cursor = "move";
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
    const selectedElementIndex = getActiveElementIndex();
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
