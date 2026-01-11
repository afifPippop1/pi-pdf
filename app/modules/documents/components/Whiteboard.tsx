import { useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { INTERACTION } from "../constant/interaction";
import { Tool } from "../constant/tooltype";
import { Canvas } from "../models/Canvas";
import { useEditorStore } from "../stores/editorStore";
import { usePdfStore } from "../stores/pdfStore";
import type { Interaction, ResizeHandle } from "../types/interaction.type";
import { createElement } from "../utils/createElement";
import { getCanvasCoordinate } from "../utils/getCanvasCoordinate";
import { getPageSize } from "../utils/getPageSize";
import { getResizeHandles } from "../utils/getResizeHandles";
import { hitHandle } from "../utils/hitHandle";
import { getAnchorFromHandle } from "../utils/getAnchorFromHandle";

const HANDLE_SIZE = 8;

export default function Whiteboard() {
  const [interaction, setInteraction] = useState<Interaction>({
    type: INTERACTION.Iddle,
  });
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  const elements = useEditorStore((s) => s.elements);
  const page = useEditorStore((s) => s.activePageIndex);
  const zoomLevel = useEditorStore((s) => s.zoomLevel);
  const activeElement = useEditorStore((s) => s.activeElement);
  const tool = useEditorStore((s) => s.tool);
  const addElement = useEditorStore((s) => s.addElement);
  const updateElement = useEditorStore((s) => s.updateElement);
  const setActiveElement = useEditorStore((s) => s.setActiveElement);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const doc = usePdfStore((s) => s.doc);
  const pageSize = getPageSize(doc, page, zoomLevel);

  function onMouseDown(e: MouseEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const { x, y } = getCanvasCoordinate(e, zoomLevel);
    if (tool === Tool.SELECT) {
      // 1. If there is an active element, check resize handles first
      if (activeElement) {
        const bounds = activeElement.getBounds();
        const handles = getResizeHandles(bounds, activeElement.PADDING);

        for (const [type, pos] of Object.entries(handles)) {
          if (hitHandle(x, y, pos.x, pos.y, HANDLE_SIZE)) {
            setInteraction({
              type: INTERACTION.Scaling,
              handle: type as ResizeHandle,
              bounds,
            });
            return;
          }
        }

        // 2. If not hitting a handle but still inside the active element → drag
        if (activeElement.containPoint(x, y)) {
          mouseRef.current = activeElement.getLocalPosition(x, y);
          setInteraction({ type: INTERACTION.Dragging });
          return;
        }
      }

      // 3. Otherwise try selecting a new element
      const element =
        elements[page]?.reverse().find((el) => el.containPoint(x, y)) || null;

      setActiveElement(element);

      if (element) {
        mouseRef.current = element.getLocalPosition(x, y);
        setInteraction({ type: INTERACTION.Dragging });
      } else {
        // 4. Clicked empty canvas → clear selection
        setInteraction({ type: INTERACTION.Iddle });
      }

      return;
    } else {
      setInteraction({ type: INTERACTION.Drawing });
      const element = createElement(tool, x, y);
      if (!element) return;
      addElement(element, page);
    }
  }

  function onMouseUp(e: MouseEvent<HTMLCanvasElement>) {
    e.preventDefault();
    if (interaction.type === INTERACTION.Drawing) {
      const element = elements[page].find(
        (element) => element.id === activeElement?.id,
      );
      if (!element) return;
      element.normalize();
      updateElement(element, page);
      setActiveElement(null);
      setInteraction({ type: INTERACTION.Iddle });
    } else if (interaction.type === INTERACTION.Scaling) {
      activeElement?.normalize();
      updateElement(activeElement!, page);
      setInteraction({ type: INTERACTION.Iddle });
    }
    mouseRef.current = null;
  }

  function onMouseMove(e: MouseEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const { x, y } = getCanvasCoordinate(e, zoomLevel);
    if (interaction.type === INTERACTION.Drawing) {
      const element = elements[page].find(
        (element) => element.id === activeElement?.id,
      );
      if (!element) return;
      element.resizeTo(x, y);
      updateElement(element, page);
    } else if (interaction.type === INTERACTION.Dragging) {
      const element = elements[page].find(
        (element) => element.id === activeElement?.id,
      );
      if (!element) return;
      if (!mouseRef.current) return;

      const { x: offsetX, y: offsetY } = mouseRef.current;
      element.moveTo(x - offsetX, y - offsetY);
      updateElement(element, page);
    } else if (interaction.type === INTERACTION.Scaling) {
      const element = activeElement;
      if (!element) return;

      const { bounds, handle } = interaction;

      // fixed corner depends on handle
      const anchor = getAnchorFromHandle(bounds, handle);

      element.resizeFromAnchor(anchor.x, anchor.y, x, y);
      updateElement(element, page);
    }
  }

  useLayoutEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const canvas = new Canvas(canvasElement);
    const dpr = window.devicePixelRatio || 1;

    canvasElement.width = pageSize.width * dpr;
    canvasElement.height = pageSize.height * dpr;
    canvasElement.style.width = `${pageSize.width}px`;
    canvasElement.style.height = `${pageSize.height}px`;

    const pageElements = elements[page];
    canvas.draw(pageElements, {
      activeElement,
      dpr,
      interaction,
      scale: zoomLevel,
    });
  }, [elements, page, pageSize, zoomLevel, activeElement, interaction]);

  return (
    <canvas
      id="whiteboard"
      ref={canvasRef}
      className="absolute top-0 left-0 h-full w-full"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    />
  );
}
