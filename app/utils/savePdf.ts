import { store } from "~/store/store";
import { drawElementsOnPdfDoc } from "./drawElementsOnPdfDoc";
import { savePdfAsURL } from "./savePdfDoc";

export async function savePdf() {
  const pdfDoc = store.getState().editor.pdfDoc;
  const elements = store.getState().editor.elements;
  const loadingTask = store.getState().editor.loadingTask;
  if (!loadingTask || !pdfDoc) return;
  const doc = await drawElementsOnPdfDoc(loadingTask, elements, pdfDoc);

  const url = await savePdfAsURL(doc);
  window.open(url);
  // const a = document.createElement("a");
  // a.href = url;
  // a.download = "Hello world.pdf";
  // document.body.appendChild(a);
  // a.click();
  // a.remove();

  // // Optional: revoke to free memory
  // setTimeout(() => URL.revokeObjectURL(url), 1000);
}
