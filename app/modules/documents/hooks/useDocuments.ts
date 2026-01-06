import { useQuery } from "@tanstack/react-query";
import { getDocuments } from "../api/documents.api";

export function useDocuments() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["documents"],
    queryFn: getDocuments,
  });

  return { data, isLoading, error };
}
