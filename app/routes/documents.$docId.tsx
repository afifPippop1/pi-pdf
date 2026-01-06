import { lazy, Suspense, useEffect } from "react";
import { useParams } from "react-router";
import { Spinner } from "~/components/ui/spinner";
import { useDocument } from "~/modules/documents/hooks/useDocument";
import { setPDFDoc } from "~/utils";

const EditorPage = lazy(() => import("~/components/pages/EditorPage"));

export default function DocumentDetail() {
  const params = useParams<{ docId: string }>();
  const { data, error, isLoading } = useDocument(params.docId);

  useEffect(() => {
    if (data?.data) {
      const file = new File([data.data], "test.pdf", { type: data.data.type });

      setPDFDoc([file]);
    }
  }, [data?.data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-dvh w-dvw">
        <Spinner />
      </div>
    );
  }

  return (
    <Suspense>
      <EditorPage />
    </Suspense>
  );
}
