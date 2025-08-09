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
import { Thumbnail } from "../molecules/Thumbnail";
import { ToolPicker } from "../molecules/ToolPicker";

export function EditorPage() {
  const { blob, setBlob } = useDocBuffer();
  const activePageIndex = useAppSelector((s) => s.editor.activePageIndex);
  const elements = useAppSelector((s) => s.editor.elements);
  const pdfDoc = useAppSelector((s) => s.editor.pdfDoc);
  const dispatch = useDispatch();

  return (
    <div className="h-screen w-screen bg-[#EDEDED] flex flex-col">
      <Navbar />
      {!blob ? (
        <EmptyFile />
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="bg-white flex items-center justify-center shrink-0">
            <ToolPicker />
          </div>
          <div className="flex-1 flex min-h-0">
            {/* Left panel */}
            <div className="overflow-auto max-w-64 min-h-0">
              <Thumbnail
                onRemove={async (index) => {
                  if (!pdfDoc) return;
                  if (pdfDoc.getPageCount() === 1) {
                    dispatch(setPDFDoc(null));
                    setBlob(undefined);
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
                }}
              />
            </div>

            {/* Right panel */}
            <div className="overflow-auto flex-1 min-h-0">
              <div className="p-8 flex justify-center">
                <Suspense>
                  <EditorCanvas buffer={blob} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
