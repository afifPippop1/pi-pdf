import { supabase } from "~/utils/supabase";

export async function getWorkspaces() {
  const response = await supabase.from("workspaces").select("*");

  return response.data || [];
}
