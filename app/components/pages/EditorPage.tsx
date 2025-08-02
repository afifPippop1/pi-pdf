import { useDispatch } from "react-redux";
import { useDocBuffer } from "~/hooks/useDocBuffer";
import { useAppSelector } from "~/store/hooks";
import { setActivePageIndex, setPDFDoc } from "~/store/slices/editorSlice";
import { getDocumentSize, getPageFromIndex } from "~/utils";
import { Button } from "../atoms/Button";
import ContextMenu, { type Option } from "../molecules/ContextMenu";
import EmptyFile from "../molecules/EmptyFile";
import { Navbar } from "../molecules/Navbar";
import { PdfViewer } from "../molecules/PDFViewer.client";
import { Whiteboard } from "../molecules/Whiteboard";

export function EditorPage() {
  const { blob, setBlob } = useDocBuffer();
  const activePageIndex = useAppSelector((s) => s.editor.activePageIndex);
  const pdfDoc = useAppSelector((s) => s.editor.pdfDoc);
  const dispatch = useDispatch();

  return (
    <div className="h-screen w-screen bg-[#EDEDED] overflow-hidden flex flex-col">
      <Navbar />
      <div className="overflow-auto flex-1 flex-col items-stretch pt-8">
        {!blob ? (
          <EmptyFile />
        ) : (
          <>
            <div className="flex gap-4">
              {pdfDoc?.getPageIndices().map((index) => {
                const options: Option[] = [
                  {
                    label: "Remove",
                    value: index,
                  },
                ];
                return (
                  <ContextMenu
                    key={index}
                    options={options}
                    onChange={async () => {
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
                        const buffer = await pdfDoc.save();
                        setBlob(buffer);
                      }
                    }}
                  >
                    <Button
                      key={index}
                      onClick={() => dispatch(setActivePageIndex(index))}
                    >
                      {getPageFromIndex(index)}
                    </Button>
                  </ContextMenu>
                );
              })}
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <PdfViewer pdfData={blob} pageIndex={activePageIndex} />
                <Whiteboard />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
