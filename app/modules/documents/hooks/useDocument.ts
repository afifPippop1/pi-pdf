import { useQuery } from "@tanstack/react-query";
import { getDocumentUrl } from "../api/document-storage.api";
import { getDocument } from "../api/documents.api";

export function useDocument(id?: string) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["document", id],
    queryFn: async () => {
      const [url, doc] = await Promise.all([
        getDocumentUrl(id!),
        getDocument(id!),
      ]);
      return {
        data: { ...doc.data, blob: url.data },
        error: url.error || doc.error,
      };
    },
    enabled: !!id,
  });

  return { data, error, isLoading };
}
