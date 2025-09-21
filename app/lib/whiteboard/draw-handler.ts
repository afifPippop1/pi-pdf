import type { RefObject } from "react";
import { actions } from "~/constants";
import {
  setAction,
  setSelectedElement,
  setToolType,
} from "~/store/slices/editorSlice";
import { store } from "~/store/store";
import {
  drawElementOnWhiteboard,
  finishDrawingOnWhiteboard,
  generateInitialElement,
  normalizeCoordinate
} from "~/utils";

interface DrawHandlerConfig {
  canvas: RefObject<HTMLCanvasElement | null>;
  dragHandler: {
    setDragOffset: (offset: { x: number; y: number }) => void;
    reset: () => void;
  };
}

export class DrawHandler {
  canvas: HTMLCanvasElement;
  config: DrawHandlerConfig;

  constructor(config: DrawHandlerConfig) {
    if (!config.canvas.current) throw Error("No canvas found");
    this.canvas = config.canvas.current;
    this.config = config;
  }

  preload({ clientX, clientY }: { clientX: number; clientY: number }) {
    const toolType = store.getState().editor.toolType;
    const zoom = store.getState().editor.zoom;

    const rect = this.canvas.getBoundingClientRect();

    const normalizedCoordinate = normalizeCoordinate({
      x: clientX,
      y: clientY,
      bounding: rect,
      zoom,
    });

    if (toolType) {
      this.canvas.style.cursor = "default";
      generateInitialElement({
        canvas: this.canvas,
        coordinate: normalizedCoordinate,
        setAction: (action) => store.dispatch(setAction(action)),
      });
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

    drawElementOnWhiteboard({
      x2: normalizedCoordinate.x,
      y2: normalizedCoordinate.y,
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
    this.preload({ clientX, clientY });
  };
  handleMouseMove = ({ clientX, clientY }: globalThis.MouseEvent) => {
    const action = store.getState().editor.action;
    if (action !== actions.DRAWING) return;
    this.update({ clientX, clientY });
  };
  handleMouseUp = () => {
    this.finish();
  };
}
