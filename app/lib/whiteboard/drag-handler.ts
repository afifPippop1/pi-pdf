import type { RefObject } from "react";
import { actions } from "~/constants";
import {
  setAction,
  setSelectedElement,
  setToolType,
} from "~/store/slices/editorSlice";
import { store } from "~/store/store";
import type { BaseCoordinate } from "~/types";
import {
  draggingElementOnWhiteboard,
  finishDrawingOnWhiteboard,
  isPointInElement,
  isPointInText,
  normalizeCoordinate,
} from "~/utils";

interface DragHandlerConfig {
  canvas: RefObject<HTMLCanvasElement | null>;
  dragHandler: {
    getDragOffset: () => BaseCoordinate;
    setDragOffset: (offset: { x: number; y: number }) => void;
    reset: () => void;
  };
}

export class DragHandler {
  canvas: HTMLCanvasElement;
  config: DragHandlerConfig;

  constructor(config: DragHandlerConfig) {
    if (!config.canvas.current) throw Error("No canvas found");
    this.canvas = config.canvas.current;
    this.config = config;
  }

  preload({ clientX, clientY }: { clientX: number; clientY: number }) {
    const element = store.getState().editor.selectedElement;
    if (!element) return;
    const zoom = store.getState().editor.zoom;
    const rect = this.canvas.getBoundingClientRect();
    const normalizedCoordinate = normalizeCoordinate({
      x: clientX,
      y: clientY,
      bounding: rect,
      zoom,
    });

    const inElement = isPointInElement({
      coordinate: normalizedCoordinate,
      element,
      scale: zoom,
    });
    const context = this.canvas.getContext("2d");
    const inText = !context
      ? false
      : isPointInText(element, normalizedCoordinate, context);
    if (inElement || inText) {
      store.dispatch(setAction(actions.DRAGGING));

      const offsetX = normalizedCoordinate.x - element.x1;
      const offsetY = normalizedCoordinate.y - element.y1;

      this.config.dragHandler.setDragOffset({ x: offsetX, y: offsetY });
    }
  }
  update({ clientX, clientY }: { clientX: number; clientY: number }) {
    const zoom = store.getState().editor.zoom;
    const rect = this.canvas.getBoundingClientRect();
    const normalizedCoordinate = normalizeCoordinate({
      x: clientX,
      y: clientY,
      bounding: rect,
      zoom,
    });
    draggingElementOnWhiteboard({
      coordinate: normalizedCoordinate,
      dragOffset: this.config.dragHandler.getDragOffset(),
    });
  }
  finish() {
    finishDrawingOnWhiteboard();
    store.dispatch(setAction(null));
    store.dispatch(setSelectedElement(null));
    this.config.dragHandler.reset();
    store.dispatch(setToolType(null));
  }

  listen() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
  }

  unlisten() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseDown = ({ clientX, clientY }: globalThis.MouseEvent) => {
    const toolType = store.getState().editor.toolType;
    const element = store.getState().editor.selectedElement;
    if (toolType || !element) return;
    this.preload({ clientX, clientY });
  };

  handleMouseMove = ({ clientX, clientY }: globalThis.MouseEvent) => {
    const action = store.getState().editor.action;
    if (action !== actions.DRAGGING) return;
    this.update({ clientX, clientY });
  };

  handleMouseUp = () => {
    this.finish();
  };
}
