import { useQuery } from "@tanstack/react-query";
import { getDocuments } from "../api/documents.api";
import { useOpenDb } from "~/hooks/useOpenDb";

export function useDocuments() {
  const db = useOpenDb();

  async function loadFromIndexDb() {
    const data = await db!.getAll("documents");
    return data;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const [cloud, local] = await Promise.all([
        getDocuments(),
        loadFromIndexDb(),
      ]);
      return [
        ...cloud.map((doc) => ({ ...doc, label: "cloud" })),
        ...local.map((doc) => ({ ...doc, label: "local" })),
      ];
    },
  });

  return { data, isLoading, error };
}
