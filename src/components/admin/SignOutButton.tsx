"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    await createBrowserSupabase().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={signOut} disabled={busy} className={cn("flex items-center gap-2", className)}>
      <LogOut className="h-4 w-4" aria-hidden="true" />
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
