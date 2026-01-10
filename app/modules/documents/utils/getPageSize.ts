import { PDFDocument } from "pdf-lib";
import { Angle } from "../constant/angle";

export function getPageSize(
  doc: PDFDocument | null,
  page: number,
  scale: number
) {
  if (!doc) return { height: 0, width: 0 };

  const angle = doc?.getPage(0).getRotation().angle;
  const size = {
    height: (doc?.getPage(page).getHeight() || 0) * scale,
    width: (doc?.getPage(page).getWidth() || 0) * scale,
  };
  if (angle === Angle.DEG_90 || angle === Angle.DEG_270) {
    return { height: size.width, width: size.height };
  }
  return size;
}
