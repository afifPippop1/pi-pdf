import { useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { v4 as uuid } from "uuid";
import { Tool } from "../constant/tooltype";
import { Canvas } from "../models/Canvas";
import { LineElement } from "../models/Line";
import { RectangleElement } from "../models/Rectangle";
import { useEditorStore } from "../stores/editorStore";
import { usePdfStore } from "../stores/pdfStore";
import { getCanvasCoordinate } from "../utils/getCanvasCoordinate";
import { getPageSize } from "../utils/getPageSize";

const ACTION = {
  Drawing: "drawing",
  Dragging: "dragging",
  Iddle: "iddle",
} as const;

type Action = (typeof ACTION)[keyof typeof ACTION];

export default function Whiteboard() {
  const [action, setAction] = useState<Action>(ACTION.Iddle);
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
    if (tool === Tool.SELECT) return;
    setAction(ACTION.Drawing);
    if (tool === Tool.LINE) {
      const element = new LineElement(uuid(), x, y, x, y);
      addElement(element, page);
    } else if (tool === Tool.RECTANGLE) {
      const element = new RectangleElement(uuid(), x, y, 0, 0);
      addElement(element, page);
    }
  }

  function onMouseUp(e: MouseEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const { clientX, clientY } = e;
    setAction(ACTION.Iddle);
    setActiveElement(null);
  }

  function onMouseMove(e: MouseEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const { clientX, clientY } = e;
    const { x, y } = getCanvasCoordinate(e, zoomLevel);
    if (action === ACTION.Drawing) {
      const element = elements[page].find(
        (element) => element.id === activeElement?.id
      );
      if (!element) return;
      if (element instanceof LineElement) {
        element.x2 = x;
        element.y2 = y;
      } else if (element instanceof RectangleElement) {
        element.width = clientX - element.x;
        element.height = clientY - element.y;
      }
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
    canvas.draw(pageElements, zoomLevel, dpr);
  }, [elements, page, pageSize, zoomLevel]);

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
