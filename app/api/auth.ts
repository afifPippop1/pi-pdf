import { supabase } from "~/utils/supabase";

export async function signInFn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}
