import * as pdfjsLib from "pdfjs-dist";
import { Suspense } from "react";
import { EditorCanvas } from "~/components/molecules/EditorCanvas.client";
import { ZoomProvider } from "~/context/ZoomContext";
import { useDocBuffer } from "~/hooks/useDocBuffer";
import { removePageHandler } from "~/utils";
import { AddFloatingButton } from "../molecules/AddFloatingButton";
import EmptyFile from "../molecules/EmptyFile";
import { Navbar } from "../molecules/Navbar";
import { PropertiesPanel } from "../molecules/PropertiesPanel";
import { Thumbnail } from "../molecules/Thumbnail.client";
import { ToolPicker } from "../molecules/ToolPicker";
import { ZoomTool } from "../molecules/ZoomTool";
import { useAppSelector } from "~/store/hooks";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export function EditorPage() {
  const { blob, setBlob } = useDocBuffer();
  const fonts = useAppSelector((s) => s.editor.fonts);

  async function handleRemove(index: number) {
    await removePageHandler(index, setBlob);
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
            </div>
            <div className="flex-1 flex gap-2 md:gap-4 flex-col-reverse md:flex-row min-h-0 p-2">
              {/* Left panel */}
              <div className="md:h-full bg-white">
                <div className="overflow-auto w-full md:w-max h-full outline rounded-lg outline-blue-500">
                  <Thumbnail onRemove={handleRemove} buffer={blob} />
                </div>
              </div>

              {/* Center panel */}
              <div className="overflow-auto flex-1 min-w-0 md:min-h-0 rounded-lg bg-gray-300">
                <div className="p-4 w-max mx-auto">
                  <Suspense>
                    <EditorCanvas buffer={blob} />
                  </Suspense>
                </div>
              </div>

              {/* Right panel */}
              <div className="hidden md:block md:h-full md:w-56 bg-white">
                <div className="overflow-y-auto w-full h-full rounded-lg">
                  <PropertiesPanel />
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
