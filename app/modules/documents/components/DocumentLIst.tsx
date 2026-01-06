import { LoaderScreen } from "~/components/pages/Loader";
import { useDocuments } from "../hooks/useDocuments";
import { DocumentCard } from "./DocumentCard";

export function DocumentList() {
  const documents = useDocuments();
  return (
    <LoaderScreen isLoading={documents.isLoading}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full w-full">
        {documents.data?.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </div>
    </LoaderScreen>
  );
}
