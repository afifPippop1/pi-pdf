import { useQuery } from "@tanstack/react-query";
import { useOpenDb } from "~/hooks/useOpenDb";
import { getDocumentUrl } from "../api/document-storage.api";
import { getDocument } from "../api/documents.api";
import type { Document } from "~/types/documents.type";

export function useDocument(id?: string) {
  const db = useOpenDb();
  async function loadFromIndexDb(): Promise<
    (Document & { blob: Blob }) | null
  > {
    const data = await db!.get("documents", id!);
    if (!data) {
      return null;
    }
    return {
      ...data,
      label: "local",
    };
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
        doc.data && url.data
          ? ({ ...doc.data, blob: url.data, label: "cloud" } as Document & {
              blob: Blob;
            })
          : indexedDbDoc;
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
