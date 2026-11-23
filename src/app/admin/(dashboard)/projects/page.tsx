import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { createServerSupabase } from "@/lib/supabase/server";
import type { ProjectRow } from "@/types/db";

export default async function AdminProjectsPage() {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
        Could not load projects: {error.message}. Have you run supabase/schema.sql?
      </p>
    );
  }

  return <ProjectsManager initial={(data ?? []) as ProjectRow[]} />;
}
