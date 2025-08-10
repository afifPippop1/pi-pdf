import { getDocument } from "pdfjs-dist";
import React from "react";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setLoadingTask } from "~/store/slices/editorSlice";

export function useDocBuffer() {
  const [blob, _setBlob] = React.useState<Uint8Array | null>(null);
  const pdfDoc = useAppSelector((s) => s.editor.pdfDoc);
  const dispatch = useAppDispatch();

  function setBlob(buffer: Uint8Array | null) {
    const loadingTask = buffer
      ? getDocument({
          data: new Uint8Array(buffer),
        })
      : null;
    dispatch(setLoadingTask(loadingTask));
    _setBlob(buffer);
  }

  React.useLayoutEffect(() => {
    if (pdfDoc) {
      (async function () {
        const buffer = await pdfDoc.save();
        setBlob(buffer);
      })();
    }
  }, [pdfDoc]);

  return { blob, setBlob };
}
