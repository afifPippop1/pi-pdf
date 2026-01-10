import { useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { INTERACTION } from "../constant/interaction";
import { Tool } from "../constant/tooltype";
import { Canvas } from "../models/Canvas";
import { useEditorStore } from "../stores/editorStore";
import { usePdfStore } from "../stores/pdfStore";
import type { Interaction } from "../types/interaction.type";
import { createElement } from "../utils/createElement";
import { getCanvasCoordinate } from "../utils/getCanvasCoordinate";
import { getPageSize } from "../utils/getPageSize";

export default function Whiteboard() {
  const [interaction, setInteraction] = useState<Interaction>(
    INTERACTION.Iddle
  );
  const mouseRef = useRef<{ x: number; y: number }>(null);

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
      const element =
        elements[page].find((element) => element.containPoint(x, y)) || null;
      setActiveElement(element);
      if (element) {
        mouseRef.current = { x, y };
        setInteraction(INTERACTION.Dragging);
      }
    } else {
      setInteraction(INTERACTION.Drawing);
      const element = createElement(tool, x, y);
      if (!element) return;
      addElement(element, page);
    }
  }

  function onMouseUp(e: MouseEvent<HTMLCanvasElement>) {
    e.preventDefault();
    if (interaction === INTERACTION.Drawing) {
      const { x, y } = getCanvasCoordinate(e, zoomLevel);
      const element = elements[page].find(
        (element) => element.id === activeElement?.id
      );
      if (!element) return;
      element.normalize(x, y);
      updateElement(element, page);
      setActiveElement(null);
    }
    setInteraction(INTERACTION.Iddle);
    mouseRef.current = null;
  }

  function onMouseMove(e: MouseEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const { x, y } = getCanvasCoordinate(e, zoomLevel);
    if (interaction === INTERACTION.Drawing) {
      const element = elements[page].find(
        (element) => element.id === activeElement?.id
      );
      if (!element) return;
      element.resizeTo(x, y);
      updateElement(element, page);
    } else if (interaction === INTERACTION.Dragging) {
      const element = elements[page].find(
        (element) => element.id === activeElement?.id
      );
      if (!element) return;
      const dx = x - (mouseRef.current?.x || 0);
      const dy = y - (mouseRef.current?.y || 0);

      element.moveTo(x, y);
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
