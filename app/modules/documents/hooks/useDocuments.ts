import { useQuery } from "@tanstack/react-query";
import { getDocuments } from "../api/documents.api";
import { useOpenDb } from "~/hooks/useOpenDb";

export function useDocuments() {
  const db = useOpenDb();

  async function loadFromIndexDb() {
    const data = await db!.getAll("documents");
    return (data || []).map((doc) => ({ ...doc, label: "local" }));
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const [cloud, local] = await Promise.all([
        getDocuments(),
        loadFromIndexDb(),
      ]);

      return [...cloud, ...local].sort((a, b) => b.created_at - a.created_at);
    },
  });

  return { data, isLoading, error };
}
