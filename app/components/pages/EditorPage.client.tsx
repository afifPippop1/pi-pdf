import * as pdfjsLib from "pdfjs-dist";
import { Suspense } from "react";
import { useDispatch } from "react-redux";
import { EditorCanvas } from "~/components/molecules/EditorCanvas.client";
import { useDocBuffer } from "~/hooks/useDocBuffer";
import { useAppSelector } from "~/store/hooks";
import {
  setActivePageIndex,
  setElements,
  setPDFDoc,
} from "~/store/slices/editorSlice";
import EmptyFile from "../molecules/EmptyFile";
import { Navbar } from "../molecules/Navbar";
import { Thumbnail } from "../molecules/Thumbnail.client";
import { ToolPicker } from "../molecules/ToolPicker";
import { PropertiesPanel } from "../molecules/PropertiesPanel";
import { ZoomTool } from "../molecules/ZoomTool";
import { ZoomProvider } from "~/context/ZoomContext";
import { AddFloatingButton } from "../molecules/AddFloatingButton";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export function EditorPage() {
  const { blob, setBlob } = useDocBuffer();
  const activePageIndex = useAppSelector((s) => s.editor.activePageIndex);
  const elements = useAppSelector((s) => s.editor.elements);
  const pdfDoc = useAppSelector((s) => s.editor.pdfDoc);
  const dispatch = useDispatch();
  async function handleRemove(index: number) {
    if (!pdfDoc) return;
    if (pdfDoc.getPageCount() === 1) {
      dispatch(setPDFDoc(null));
      setBlob(null);
    } else {
      if (activePageIndex === index) {
        if (activePageIndex !== 0) {
          dispatch(setActivePageIndex(index - 1));
        }
      }
      pdfDoc.removePage(index);
      const el = elements.filter((_, idx) => idx !== index);
      dispatch(setElements(el));
      const buffer = await pdfDoc.save();
      setBlob(buffer);
    }
  }

  return (
    <div className="h-dvh w-dvw flex flex-col">
      <Navbar />
      {!blob ? (
        <EmptyFile />
      ) : (
        <ZoomProvider>
          <div className="flex-1 flex flex-col min-h-0">
            <div className="bg-white flex items-center shrink-0">
              <ToolPicker />
              <div className="flex-1 flex justify-center items-center">
                <ZoomTool />
              </div>
              <div className="w-64 h-full">
                <PropertiesPanel />
              </div>
            </div>
            <div className="flex-1 flex gap-2 md:gap-4 flex-col-reverse md:flex-row min-h-0 p-2">
              {/* Left panel */}
              <div className="md:h-full bg-white">
                <div className="overflow-auto w-full md:w-max h-full outline rounded-lg outline-blue-500">
                  <Thumbnail onRemove={handleRemove} buffer={blob} />
                </div>
              </div>

              {/* Right panel */}
              <div className="overflow-auto flex-1 min-w-0 md:min-h-0 rounded-lg bg-gray-300">
                <div className="p-4 w-max mx-auto">
                  <Suspense>
                    <EditorCanvas buffer={blob} />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </ZoomProvider>
      )}
      <AddFloatingButton />
    </div>
  );
}
