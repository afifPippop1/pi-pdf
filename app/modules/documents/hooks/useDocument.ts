import { useQuery } from "@tanstack/react-query";
import { getDocumentUrl } from "../api/document-storage.api";

export function useDocument(id?: string) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["document", id],
    queryFn: () => getDocumentUrl(id!),
    enabled: !!id,
  });

  return { data, error, isLoading };
}
