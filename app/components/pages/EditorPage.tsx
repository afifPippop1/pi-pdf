import { useDispatch } from "react-redux";
import { EditorCanvas } from "~/.client/components/molecules/EditorCanvas";
import { useDocBuffer } from "~/hooks/useDocBuffer";
import { useAppSelector } from "~/store/hooks";
import {
  setActivePageIndex,
  setElements,
  setPDFDoc,
} from "~/store/slices/editorSlice";
import { getPageFromIndex } from "~/utils";
import { Button } from "../atoms/Button";
import ContextMenu, {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../molecules/ContextMenu";
import EmptyFile from "../molecules/EmptyFile";
import { Navbar } from "../../.client/components/molecules/Navbar";
import { ToolPicker } from "../molecules/ToolPicker";

export function EditorPage() {
  const { blob, setBlob } = useDocBuffer();
  const activePageIndex = useAppSelector((s) => s.editor.activePageIndex);
  const elements = useAppSelector((s) => s.editor.elements);
  const pdfDoc = useAppSelector((s) => s.editor.pdfDoc);
  const dispatch = useDispatch();

  return (
    <div className="h-screen w-screen bg-[#EDEDED] overflow-hidden flex flex-col">
      <Navbar />
      <div className="overflow-auto flex-1 flex-col items-stretch pt-8 relative">
        {!blob ? (
          <EmptyFile />
        ) : (
          <>
            <div className="flex gap-4">
              {pdfDoc?.getPageIndices().map((index) => (
                <ContextMenu key={index}>
                  <ContextMenuTrigger>
                    <Button
                      key={index}
                      onClick={() => dispatch(setActivePageIndex(index))}
                    >
                      {getPageFromIndex(index)}
                    </Button>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem
                      onClick={async () => {
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
                    >
                      Remove
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </div>
            <div className="flex justify-center">
              <EditorCanvas buffer={blob} />
            </div>
            <ToolPicker />
          </>
        )}
      </div>
    </div>
  );
}
