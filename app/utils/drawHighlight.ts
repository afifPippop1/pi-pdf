import type { Element } from "~/types";
import { isShapeElement } from "./isShapeElement";

export function drawHighlight(ctx: CanvasRenderingContext2D, element: Element) {
  drawHighlightOutline(ctx, element);

  const points = getHandlePoints(element);
  points?.forEach((pt) => {
    drawBullet(ctx, pt.x, pt.y);
  });
}

function drawHighlightOutline(ctx: CanvasRenderingContext2D, element: Element) {
  if (isShapeElement(element)) {
    ctx.save();
    ctx.strokeStyle = "#007bff";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      Math.min(element.x1, element.x2),
      Math.min(element.y1, element.y2),
      Math.abs(element.x2 - element.x1),
      Math.abs(element.y2 - element.y1)
    );
    ctx.restore();
  }
}

function getHandlePoints(el: Element) {
  if (isShapeElement(el)) {
    const x1 = Math.min(el.x1, el.x2);
    const y1 = Math.min(el.y1, el.y2);
    const x2 = Math.max(el.x1, el.x2);
    const y2 = Math.max(el.y1, el.y2);

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

function drawBullet(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const radius = 6;
  const startAngle = 0; // 0deg
  const endAngle = 2 * Math.PI; //so it will be 360deg
  ctx.save();
  ctx.fillStyle = "#007bff"; // blue
  ctx.strokeStyle = "#fff"; // white border
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
