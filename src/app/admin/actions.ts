"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Called by the admin portal after every save so public pages show the change
 * immediately instead of waiting for the 60-second cache. Only admins can trigger it.
 */
export async function revalidateSite(): Promise<{ ok: boolean }> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) return { ok: false };

  revalidateTag("site-data");
  revalidatePath("/", "layout");
  return { ok: true };
}
