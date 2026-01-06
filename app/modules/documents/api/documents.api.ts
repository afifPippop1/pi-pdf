import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import type {
  Document,
  InsertDocument,
  UpdateDocument,
} from "~/types/documents.type";
import { supabase } from "~/utils/supabase";

const TABLE = "documents";

export async function getDocuments() {
  const res = await supabase.from(TABLE).select("*");
  return res.data || [];
}

export async function getDocument(
  id: string
): Promise<PostgrestSingleResponse<Document>> {
  return await supabase.from(TABLE).select("*").eq("id", id).single();
}

export async function insertDocument({
  id,
  name,
}: Pick<InsertDocument, "id" | "name">) {
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    throw new Error("Unauthorized");
  }
  const path = `${user.data.user?.id}/${id}.pdf`;
  return await supabase
    .from(TABLE)
    .insert({ id, path, name, user_id: user.data.user.id });
}

export async function updateDocument(id: string, data: UpdateDocument) {
  return await supabase.from(TABLE).update(data).eq("id", id);
}

export async function deleteDocument(id: string) {
  return await supabase.from(TABLE).delete().eq("id", id);
}
