import { lazy, Suspense, useEffect } from "react";
import { useParams } from "react-router";
import { LoaderScreen } from "~/components/pages/Loader";
import { useDocument } from "~/modules/documents/hooks/useDocument";
import { useEditorStore } from "~/store/editorStore";
import { setPDFDoc } from "~/utils";

const DocumentEditor = lazy(
  () => import("~/modules/documents/components/DocumentEditor")
);
const PdfProvider = lazy(
  () => import("~/modules/documents/providers/PdfProviders")
);

export default function DocumentDetail() {
  const params = useParams<{ docId: string }>();
  const { data, error, isLoading } = useDocument(params.docId);
  const setDocument = useEditorStore((s) => s.setDocument);

  useEffect(() => {
    if (data?.data?.blob) {
      const doc = data.data;
      const file = new File([doc.blob], doc.name || "", {
        type: data.data.blob.type,
      });

      setPDFDoc([file]);
      setDocument(doc);
    }
  }, [data?.data]);

  return (
    <Suspense>
      <div className="h-dvh w-dvw">
        <LoaderScreen isLoading={isLoading}>
          <PdfProvider>
            <DocumentEditor />
          </PdfProvider>
        </LoaderScreen>
      </div>
    </Suspense>
  );
}
