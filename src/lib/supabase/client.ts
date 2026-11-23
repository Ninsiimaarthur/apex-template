import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

/** Browser client for the admin portal (login, edits, image uploads). */
export function createBrowserSupabase() {
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}
