import React, { useEffect } from "react";
import { useAppSelector } from "~/store/hooks";
import { PdfViewer } from "../molecules/DocViewer.client";
import EmptyFile from "../molecules/EmptyFile";
import { Navbar } from "../molecules/Navbar";
import { Button } from "../atoms/Button";

export function EditorPage() {
  const files = useAppSelector((s) => s.editor.files);
  const [blob, setBlob] = React.useState<Uint8Array>();
  const [page, setPage] = React.useState<number>(1);

  useEffect(() => {
    if (files.length) {
      (async function () {
        setBlob(new Uint8Array(await files[0].arrayBuffer()));
      })();
    }
  }, [files]);

  return (
    <div className="h-screen w-screen bg-[#EDEDED] overflow-hidden flex flex-col">
      <Navbar />
      <div className="overflow-auto flex-1 flex-col items-stretch pt-8">
        {!blob ? (
          <EmptyFile />
        ) : (
          <>
            <div className="flex gap-4">
              {[1, 2, 3].map((page) => (
                <Button key={page} onClick={() => setPage(page)}>
                  {page}
                </Button>
              ))}
            </div>
            <div className="flex justify-center">
              <PdfViewer pdfData={blob} page={page} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
