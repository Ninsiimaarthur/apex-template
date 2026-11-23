import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

/**
 * Cookie-less, read-only client for public pages (anon key + RLS).
 * Requests are cached for 60s and tagged "site-data", so the admin portal
 * can refresh them instantly with revalidateTag("site-data").
 */
export function createPublicClient() {
  return createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) =>
        fetch(input, { ...init, next: { revalidate: 60, tags: ["site-data"] } }),
    },
  });
}
