import { lazy, Suspense, useEffect } from "react";
import { useParams } from "react-router";
import { LoaderScreen } from "~/components/pages/Loader";
import { useDocument } from "~/modules/documents/hooks/useDocument";
import { useAppDispatch } from "~/store/hooks";
import { setDocument } from "~/store/slices/editorSlice";
import { setPDFDoc } from "~/utils";

const EditorPage = lazy(() => import("~/components/pages/EditorPage"));

export default function DocumentDetail() {
  const params = useParams<{ docId: string }>();
  const { data, error, isLoading } = useDocument(params.docId);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data?.data?.blob) {
      const { blob, ...doc } = data.data;
      const file = new File([blob], doc.name || "", {
        type: data.data.blob.type,
      });

      setPDFDoc([file]);
      dispatch(setDocument(doc));
    }
  }, [data?.data]);

  return (
    <Suspense>
      <div className="h-dvh w-dvw">
        <LoaderScreen isLoading={isLoading}>
          <EditorPage />
        </LoaderScreen>
      </div>
    </Suspense>
  );
}
