import type { PDFPageProxy, RenderTask } from "pdfjs-dist";

export class PDFPageRenderer {
  private renderTask: RenderTask | null = null;

  render({
    page,
    canvas,
    scale,
  }: {
    page: PDFPageProxy;
    canvas: HTMLCanvasElement;
    scale: number;
  }) {
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    const viewport = page.getViewport({ scale });
    const outputScale = window.devicePixelRatio || 1;

    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    const transform =
      outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

    this.renderTask?.cancel();

    this.renderTask = page.render({
      canvasContext: context,
      viewport,
      canvas,
      transform,
    });

    this.renderTask?.promise.catch((err: any) => {
      if (err?.name !== "RenderingCancelledException") {
        console.error("Render error:", err);
      }
    });
  }

  cancel() {
    this.renderTask?.cancel();
    this.renderTask = null;
  }
}
