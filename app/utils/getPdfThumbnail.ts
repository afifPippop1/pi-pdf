import { type PDFDocumentLoadingTask } from "pdfjs-dist";

export async function getPdfPageThumbnail(
  loadingTask: PDFDocumentLoadingTask,
  pageNum: number,
  scale = 0.2
): Promise<string> {
  const pdf = await loadingTask.promise;

  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not get 2D context");

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: context, viewport, canvas }).promise;

  return canvas.toDataURL("image/png");
}
