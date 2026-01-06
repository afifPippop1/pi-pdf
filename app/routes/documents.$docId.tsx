import { lazy, Suspense, useEffect } from "react";
import { useParams } from "react-router";
import { LoaderScreen } from "~/components/pages/Loader";
import { useDocument } from "~/modules/documents/hooks/useDocument";
import { setPDFDoc } from "~/utils";

const EditorPage = lazy(() => import("~/components/pages/EditorPage"));

export default function DocumentDetail() {
  const params = useParams<{ docId: string }>();
  const { data, error, isLoading } = useDocument(params.docId);

  useEffect(() => {
    if (data?.data.blob) {
      const file = new File([data.data.blob], data.data.name || "", {
        type: data.data.blob.type,
      });

      setPDFDoc([file]);
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
