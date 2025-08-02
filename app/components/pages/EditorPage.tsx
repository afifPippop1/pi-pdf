import React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "~/store/hooks";
import { setActivePage, setPDFDoc } from "~/store/slices/editorSlice";
import { Button } from "../atoms/Button";
import ContextMenu, { type Option } from "../molecules/ContextMenu";
import { PdfViewer } from "../molecules/DocViewer.client";
import EmptyFile from "../molecules/EmptyFile";
import { Navbar } from "../molecules/Navbar";

function getPageFromIndex(index: number): number {
  return index + 1;
}

export function EditorPage() {
  const [blob, setBlob] = React.useState<Uint8Array>();
  const activePage = useAppSelector((s) => s.editor.activePage);
  const pdfDoc = useAppSelector((s) => s.editor.pdfDoc);
  const dispatch = useDispatch();

  React.useLayoutEffect(() => {
    if (pdfDoc) {
      (async function () {
        const buffer = await pdfDoc.save();
        setBlob(buffer);
      })();
    }
  }, [pdfDoc]);

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
                        if (activePage === getPageFromIndex(index)) {
                          if (activePage !== 1) {
                            dispatch(setActivePage(index));
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
                      onClick={() =>
                        dispatch(setActivePage(getPageFromIndex(index)))
                      }
                    >
                      {getPageFromIndex(index)}
                    </Button>
                  </ContextMenu>
                );
              })}
            </div>
            <div className="flex justify-center">
              <PdfViewer pdfData={blob} page={activePage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
