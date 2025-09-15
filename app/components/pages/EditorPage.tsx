import * as pdfjsLib from "pdfjs-dist";
import { Suspense } from "react";
import { EditorCanvas } from "~/components/molecules/EditorCanvas";
import { ZoomProvider } from "~/context/ZoomContext";
import { useDocBuffer } from "~/hooks/useDocBuffer";
import { removePageHandler } from "~/utils";
import { AddFloatingButton } from "../molecules/AddFloatingButton";
import EmptyFile from "../molecules/EmptyFile";
import { Navbar } from "../molecules/Navbar";
import { PropertiesPanel } from "../molecules/PropertiesPanel";
import { Thumbnail } from "../molecules/Thumbnail";
import { ToolPicker } from "../molecules/ToolPicker";
import { ZoomTool } from "../molecules/ZoomTool";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function EditorPage() {
  const { blob, setBlob } = useDocBuffer();

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
              {/* <div className="flex-1 flex justify-end items-center"></div> */}
            </div>
            <div className="flex-1 flex gap-2 md:gap-4 flex-col-reverse md:flex-row min-h-0 p-2">
              {/* Left panel */}
              <div className="md:h-full bg-white">
                <div className="overflow-auto w-full md:w-max h-full outline rounded-lg outline-blue-500">
                  <Thumbnail onRemove={handleRemove} buffer={blob} />
                </div>
              </div>

              {/* Center panel */}
              <div className="relative overflow-auto flex-1 min-w-0 md:min-h-0 rounded-lg bg-gray-300">
                <div className="p-4 pb-10 flex justify-center items-center min-h-full">
                  <Suspense>
                    <EditorCanvas buffer={blob} />
                  </Suspense>
                </div>
                <div className="sticky bottom-4 left-4 bg-white rounded p-2 text-xs inline-block shadow-lg">
                  <ZoomTool />
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
