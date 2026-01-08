import { getDocument } from "pdfjs-dist";

export function getLoadingTask(data: Uint8Array<ArrayBufferLike>) {
  return getDocument({ data });
}
