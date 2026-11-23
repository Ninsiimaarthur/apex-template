"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useMemo, useState } from "react";
import { Loader2, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { revalidateSite } from "@/app/admin/actions";
import { AdminField, adminInput, errorMessage, ghostBtn, primaryBtn } from "@/components/admin/ui";
import { ImageField } from "@/components/admin/ImageField";
import { Toast } from "@/components/forms/Toast";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { deleteImageByUrl, uploadImage } from "@/lib/supabase/storage";
import type { ProjectRow } from "@/types/db";

type ToastState = { type: "success" | "error"; message: string } | null;

export function ProjectsManager({ initial }: { initial: ProjectRow[] }) {
  const [items, setItems] = useState<ProjectRow[]>(initial);
  const [editing, setEditing] = useState<string | null>(null); // a project id, or "new"
  const [toast, setToast] = useState<ToastState>(null);
  const closeToast = useCallback(() => setToast(null), []);

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [items]
  );
  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);

  async function remove(project: ProjectRow) {
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    const supabase = createBrowserSupabase();
    const { data, error } = await supabase.from("projects").delete().eq("id", project.id).select("id");
    if (error || !data || data.length === 0) {
      setToast({
        type: "error",
        message: error ? errorMessage(error) : "Nothing was deleted. Check that you are signed in as an admin.",
      });
      return;
    }
    await deleteImageByUrl(project.image_url);
    setItems((prev) => prev.filter((p) => p.id !== project.id));
    await revalidateSite();
    setToast({ type: "success", message: "Project deleted." });
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl">Projects Gallery</h1>
          <p className="mt-1 text-sm text-slate-500">
            Past work shown on the Projects page. Categories become the filter buttons visitors can click.
          </p>
        </div>
        <button type="button" className={primaryBtn} onClick={() => setEditing("new")} disabled={editing === "new"}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add project
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {editing === "new" && (
          <ProjectForm
            project={null}
            categories={categories}
            onCancel={() => setEditing(null)}
            onSaved={(row) => {
              setItems((prev) => [row, ...prev]);
              setEditing(null);
              setToast({ type: "success", message: "Project added." });
            }}
          />
        )}

        {sorted.map((project) =>
          editing === project.id ? (
            <ProjectForm
              key={project.id}
              project={project}
              categories={categories}
              onCancel={() => setEditing(null)}
              onSaved={(row) => {
                setItems((prev) => prev.map((p) => (p.id === row.id ? row : p)));
                setEditing(null);
                setToast({ type: "success", message: "Changes saved." });
              }}
            />
          ) : (
            <div
              key={project.id}
              className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
            >
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {project.image_url && (
                  <img src={project.image_url} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-secondary">{project.title}</p>
                <p className="flex flex-wrap items-center gap-x-2 text-sm text-slate-500">
                  <span>{project.category}</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {project.location}
                  </span>
                  {project.specs && <span>· {project.specs}</span>}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className={ghostBtn} onClick={() => setEditing(project.id)}>
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${project.title}`}
                  onClick={() => remove(project)}
                  className="rounded-lg p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )
        )}

        {sorted.length === 0 && editing !== "new" && (
          <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            No projects yet. Click Add project to showcase your first job.
          </p>
        )}
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={closeToast} />}
    </div>
  );
}

function ProjectForm({
  project,
  categories,
  onSaved,
  onCancel,
}: {
  project: ProjectRow | null;
  categories: string[];
  onSaved: (row: ProjectRow) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [category, setCategory] = useState(project?.category ?? "");
  const [location, setLocation] = useState(project?.location ?? "");
  const [specs, setSpecs] = useState(project?.specs ?? "");
  const [summary, setSummary] = useState(project?.summary ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [removed, setRemoved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    if (!title.trim()) return setError("Title is required.");

    setError(null);
    setSaving(true);

    const supabase = createBrowserSupabase();
    const oldUrl = project?.image_url ?? null;
    let imageUrl = oldUrl;
    let uploadedUrl: string | null = null;

    try {
      if (file) {
        uploadedUrl = await uploadImage(file, "projects");
        imageUrl = uploadedUrl;
      } else if (removed) {
        imageUrl = null;
      }

      const payload = {
        title: title.trim(),
        category: category.trim() || "General",
        location: location.trim(),
        specs: specs.trim() || null,
        summary: summary.trim() || null,
        image_url: imageUrl,
      };

      const { data, error: saveError } = project
        ? await supabase.from("projects").update(payload).eq("id", project.id).select().single()
        : await supabase.from("projects").insert(payload).select().single();

      if (saveError) throw saveError;

      if (oldUrl && oldUrl !== imageUrl) await deleteImageByUrl(oldUrl);
      await revalidateSite();
      onSaved(data as ProjectRow);
    } catch (err) {
      if (uploadedUrl) await deleteImageByUrl(uploadedUrl);
      setError(errorMessage(err));
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-2xl border-2 border-primary/40 bg-white p-6">
      <h2 className="text-lg">{project ? "Edit project" : "New project"}</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <AdminField label="Title" htmlFor="p-title">
          <input id="p-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={adminInput} />
        </AdminField>
        <AdminField label="Category" htmlFor="p-category" hint="Becomes a filter button on the Projects page.">
          <input
            id="p-category"
            type="text"
            list="project-categories"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={adminInput}
            placeholder="e.g. Residential Solar"
          />
          <datalist id="project-categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </AdminField>
        <AdminField label="Location" htmlFor="p-location">
          <input
            id="p-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={adminInput}
            placeholder="Kampala"
          />
        </AdminField>
        <AdminField label="System size / specs" htmlFor="p-specs">
          <input
            id="p-specs"
            type="text"
            value={specs}
            onChange={(e) => setSpecs(e.target.value)}
            className={adminInput}
            placeholder="5 kW hybrid · 10 kWh battery"
          />
        </AdminField>
      </div>

      <AdminField label="Short description" htmlFor="p-summary">
        <textarea
          id="p-summary"
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className={adminInput}
        />
      </AdminField>

      <ImageField
        currentUrl={project?.image_url ?? null}
        file={file}
        removed={removed}
        onPick={(picked) => {
          setFile(picked);
          setRemoved(false);
        }}
        onRemove={() => {
          setFile(null);
          setRemoved(true);
        }}
      />

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className={primaryBtn}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Saving…
            </>
          ) : (
            "Save"
          )}
        </button>
        <button type="button" className={ghostBtn} onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}
