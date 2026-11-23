import type { Metadata } from "next";
import { getSiteData } from "@/lib/site-data";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const { brand } = await getSiteData();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white">
            {brand.name.charAt(0)}
          </span>
          <h1 className="mt-4 text-2xl">Admin sign in</h1>
          <p className="mt-1 text-sm text-slate-500">{brand.name}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {isSupabaseConfigured ? (
            <LoginForm />
          ) : (
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-secondary">Supabase is not configured yet.</p>
              <p>
                Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file, restart the
                dev server, then reload this page. Full steps are in supabase/README.md.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
