import {
  actions,
  HIGHLIGHT_CORNER_HALF_SIZE,
  HIGHLIGHT_CORNER_SIZE,
  HIGHLIGHT_PADDING,
  toolTypes,
} from "~/constants";
import type { BaseCoordinate, Coordinate2D, Element } from "~/types";
import type { Action } from "~/types/action";
import { isShapeElement } from "~/utils";

const hoverPositionDefaultValue = {
  on: false,
  onLeft: false,
  onRight: false,
  onTop: false,
  onBottom: false,
  onTopRight: false,
  onBottomRight: false,
  onBottomLeft: false,
  onTopLeft: false,
};

export class ComponentHighlighter {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private element: Element
  ) {}

  drawHighlight() {
    this.drawHighlightOutline();

    const points = this.getHandlePoints();
    points?.forEach((pt) => {
      this.drawCorner(this.ctx, pt.x, pt.y);
    });
  }

  private drawELementHighlight() {
    if (!isShapeElement(this.element)) return;
    const x = Math.min(this.element.x1, this.element.x2) - HIGHLIGHT_PADDING;
    const y = Math.min(this.element.y1, this.element.y2) - HIGHLIGHT_PADDING;
    const width =
      Math.abs(this.element.x2 - this.element.x1) + HIGHLIGHT_PADDING * 2;
    const height =
      Math.abs(this.element.y2 - this.element.y1) + HIGHLIGHT_PADDING * 2;
    this.ctx.strokeRect(x, y, width, height);
  }

  private drawTextHighlight() {
    if (isShapeElement(this.element)) return;
    const width = this.ctx.measureText(this.element.text).width;
    const height = this.element.properties.fontSize;
    const x2 = this.element.x1 + width;
    const y2 = this.element.y1 + height;

    this.ctx.strokeRect(
      Math.min(this.element.x1, x2),
      Math.min(this.element.y1, y2),
      Math.abs(x2 - this.element.x1),
      Math.abs(y2 - this.element.y1)
    );
  }

  private drawHighlightOutline() {
    this.ctx.save();
    this.ctx.strokeStyle = "#007bff";
    this.ctx.lineWidth = 2;
    if (isShapeElement(this.element)) {
      this.drawELementHighlight();
    } else if (
      this.element.type === toolTypes.TEXT &&
      this.element.text.length
    ) {
      this.drawTextHighlight();
    }
    this.ctx.restore();
  }

  private getHandlePoints() {
    if (isShapeElement(this.element)) {
      const x1 = Math.min(this.element.x1, this.element.x2) - HIGHLIGHT_PADDING;
      const y1 = Math.min(this.element.y1, this.element.y2) - HIGHLIGHT_PADDING;
      const x2 = Math.max(this.element.x1, this.element.x2) + HIGHLIGHT_PADDING;
      const y2 = Math.max(this.element.y1, this.element.y2) + HIGHLIGHT_PADDING;

      const cx = (x1 + x2) / 2;
      const cy = (y1 + y2) / 2;

      return [
        { x: x1, y: y1 }, // top-left
        { x: cx, y: y1 }, // top-center
        { x: x2, y: y1 }, // top-right
        { x: x2, y: cy }, // right-center
        { x: x2, y: y2 }, // bottom-right
        { x: cx, y: y2 }, // bottom-center
        { x: x1, y: y2 }, // bottom-left
        { x: x1, y: cy }, // left-center
      ];
    }
  }

  private drawCorner(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    ctx.strokeRect(
      x - HIGHLIGHT_CORNER_HALF_SIZE,
      y - HIGHLIGHT_CORNER_HALF_SIZE,
      HIGHLIGHT_CORNER_SIZE,
      HIGHLIGHT_CORNER_SIZE
    );
    ctx.strokeStyle = "#007bff"; // blue
    ctx.fillStyle = "#fff";
    ctx.fillRect(x - 4, y - 4, 8, 8);
    ctx.lineWidth = 1;
    ctx.restore();
  }

  onHover(
    coordinate: BaseCoordinate,
    handler: (action: Action | null) => void
  ) {
    const hoverPosition = this.isOnHighlight(coordinate);
    if (hoverPosition.on) {
      if (hoverPosition.onTopRight) {
        handler(actions.SCALING_TOP_RIGHT);
      } else if (hoverPosition.onTopLeft) {
        handler(actions.SCALING_TOP_LEFT);
      } else if (hoverPosition.onBottomRight) {
        handler(actions.SCALING_BOTTOM_RIGHT);
      } else if (hoverPosition.onBottomLeft) {
        handler(actions.SCALING_BOTTOM_LEFT);
      } else if (hoverPosition.onTop) {
        handler(actions.SCALING_TOP);
      } else if (hoverPosition.onBottom) {
        handler(actions.SCALING_BOTTOM);
      } else if (hoverPosition.onLeft) {
        handler(actions.SCALING_LEFT);
      } else if (hoverPosition.onRight) {
        handler(actions.SCALING_RIGHT);
      }
    }
  }

  isOnHighlight(coordinate: BaseCoordinate) {
    if (isShapeElement(this.element)) {
      return this.hoverPosition(coordinate, this.element);
    } else if (this.element.type === toolTypes.TEXT) {
      const width = this.ctx?.measureText(this.element.text).width;
      const height = this.element.properties.fontSize;
      const x2 = this.element.x1 + width;
      const y2 = this.element.y1 + height;
      const elementCoordinate = {
        x1: this.element.x1,
        x2,
        y1: this.element.y1,
        y2,
      };
      return this.hoverPosition(coordinate, elementCoordinate);
    }
    return hoverPositionDefaultValue;
  }

  private hoverPosition(
    coordinate: BaseCoordinate,
    elementCoordinate: Coordinate2D
  ) {
    const tolerance = 5;
    const onLeft =
      Math.abs(coordinate.x - elementCoordinate.x1 + HIGHLIGHT_PADDING) <=
        tolerance &&
      coordinate.y >= elementCoordinate.y1 - HIGHLIGHT_PADDING &&
      coordinate.y <= elementCoordinate.y2 + HIGHLIGHT_PADDING;

    const onRight =
      Math.abs(coordinate.x - elementCoordinate.x2 - HIGHLIGHT_PADDING) <=
        tolerance &&
      coordinate.y >= elementCoordinate.y1 + HIGHLIGHT_PADDING &&
      coordinate.y <= elementCoordinate.y2 - HIGHLIGHT_PADDING;

    const onTop =
      Math.abs(coordinate.y - elementCoordinate.y1 + HIGHLIGHT_PADDING) <=
        tolerance &&
      coordinate.x >= elementCoordinate.x1 - HIGHLIGHT_PADDING &&
      coordinate.x <= elementCoordinate.x2 + HIGHLIGHT_PADDING;

    const onBottom =
      Math.abs(coordinate.y - elementCoordinate.y2 - HIGHLIGHT_PADDING) <=
        tolerance &&
      coordinate.x >= elementCoordinate.x1 + HIGHLIGHT_PADDING &&
      coordinate.x <= elementCoordinate.x2 - HIGHLIGHT_PADDING;

    const onTopRight =
      Math.abs(coordinate.x - elementCoordinate.x2 - HIGHLIGHT_PADDING) <=
        tolerance &&
      Math.abs(coordinate.y - elementCoordinate.y1 + HIGHLIGHT_PADDING) <=
        tolerance;

    const onBottomRight =
      Math.abs(coordinate.x - elementCoordinate.x2 - HIGHLIGHT_PADDING) <=
        tolerance &&
      Math.abs(coordinate.y - elementCoordinate.y2 - HIGHLIGHT_PADDING) <=
        tolerance;

    const onBottomLeft =
      Math.abs(coordinate.x - elementCoordinate.x1 + HIGHLIGHT_PADDING) <=
        tolerance &&
      Math.abs(coordinate.y - elementCoordinate.y2 - HIGHLIGHT_PADDING) <=
        tolerance;

    const onTopLeft =
      Math.abs(coordinate.x - elementCoordinate.x1 + HIGHLIGHT_PADDING) <=
        tolerance &&
      Math.abs(coordinate.y - elementCoordinate.y1 + HIGHLIGHT_PADDING) <=
        tolerance;

    return {
      on:
        onLeft ||
        onRight ||
        onTop ||
        onBottom ||
        onTopRight ||
        onBottomRight ||
        onBottomLeft ||
        onTopLeft,
      onLeft,
      onRight,
      onTop,
      onBottom,
      onTopRight,
      onBottomRight,
      onBottomLeft,
      onTopLeft,
    };
  }

  static new(ctx: CanvasRenderingContext2D, element: Element) {
    return new ComponentHighlighter(ctx, element);
  }
}
