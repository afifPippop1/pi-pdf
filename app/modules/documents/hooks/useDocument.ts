import { useQuery } from "@tanstack/react-query";
import { useOpenDb } from "~/hooks/useOpenDb";
import { getDocumentUrl } from "../api/document-storage.api";
import { getDocument } from "../api/documents.api";

export function useDocument(id?: string) {
  const db = useOpenDb();
  async function loadFromIndexDb() {
    const data = await db!.get("documents", id!);
    return data;
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ["document", id],
    queryFn: async () => {
      const [url, doc, indexedDbDoc] = await Promise.all([
        getDocumentUrl(id!),
        getDocument(id!),
        loadFromIndexDb(),
      ]);
      const data =
        doc.data && url.data ? { ...doc.data, blob: url.data } : indexedDbDoc;
      const error = !indexedDbDoc ? url.error || doc.error : null;
      return {
        data,
        error,
      };
    },
    enabled: !!id,
  });

  return { data, error, isLoading };
}
