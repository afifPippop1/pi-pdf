import { supabase } from "~/utils/supabase";
import { v4 as uuid } from "uuid";

export async function uploadDocument({
  id,
  file,
}: {
  id?: string;
  file: Blob;
}) {
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    throw new Error("Unauthorized");
  }
  id = id || uuid();
  const path = `${user.data.user?.id}/${id}.pdf`;
  const { data, error } = await supabase.storage
    .from("documents")
    .upload(path, file, {
      contentType: "application/pdf",
      upsert: true,
    });
  return { data: { ...data, id }, error: error };
}

export async function getDocumentUrl(id: string) {
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    throw new Error("Unauthorized");
  }
  const path = `${user.data.user?.id}/${id}.pdf`;
  return supabase.storage.from("documents").download(path);
}
