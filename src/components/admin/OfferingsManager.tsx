"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useMemo, useState } from "react";
import { Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { revalidateSite } from "@/app/admin/actions";
import { AdminField, adminInput, errorMessage, ghostBtn, primaryBtn } from "@/components/admin/ui";
import { ImageField } from "@/components/admin/ImageField";
import { Toast } from "@/components/forms/Toast";
import { formatUgx } from "@/lib/offering";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { deleteImageByUrl, uploadImage } from "@/lib/supabase/storage";
import { cn } from "@/lib/utils";
import type { OfferingRow } from "@/types/db";

type ToastState = { type: "success" | "error"; message: string } | null;

export function OfferingsManager({ initial }: { initial: OfferingRow[] }) {
  const [items, setItems] = useState<OfferingRow[]>(initial);
  const [editing, setEditing] = useState<string | null>(null); // an item id, or "new"
  const [toast, setToast] = useState<ToastState>(null);
  const closeToast = useCallback(() => setToast(null), []);

  const sorted = useMemo(
    () => [...items].sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title)),
    [items]
  );
  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);
  const nextSort = items.reduce((max, i) => Math.max(max, i.sort_order), 0) + 10;

  async function toggleFeatured(item: OfferingRow) {
    const supabase = createBrowserSupabase();
    const { data, error } = await supabase
      .from("services_products")
      .update({ is_featured: !item.is_featured })
      .eq("id", item.id)
      .select()
      .single();
    if (error) {
      setToast({ type: "error", message: errorMessage(error) });
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === item.id ? (data as OfferingRow) : i)));
    await revalidateSite();
  }

  async function remove(item: OfferingRow) {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    const supabase = createBrowserSupabase();
    const { data, error } = await supabase.from("services_products").delete().eq("id", item.id).select("id");
    if (error || !data || data.length === 0) {
      setToast({
        type: "error",
        message: error ? errorMessage(error) : "Nothing was deleted. Check that you are signed in as an admin.",
      });
      return;
    }
    await deleteImageByUrl(item.image_url);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    await revalidateSite();
    setToast({ type: "success", message: "Item deleted." });
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl">Products &amp; Services</h1>
          <p className="mt-1 text-sm text-slate-500">
            Items appear on the Services page, grouped by category. Featured items are shown first on the home page.
          </p>
        </div>
        <button
          type="button"
          className={primaryBtn}
          onClick={() => setEditing("new")}
          disabled={editing === "new"}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add item
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {editing === "new" && (
          <OfferingForm
            item={null}
            defaultSort={nextSort}
            categories={categories}
            onCancel={() => setEditing(null)}
            onSaved={(row) => {
              setItems((prev) => [...prev, row]);
              setEditing(null);
              setToast({ type: "success", message: "Item added." });
            }}
          />
        )}

        {sorted.map((item) =>
          editing === item.id ? (
            <OfferingForm
              key={item.id}
              item={item}
              defaultSort={item.sort_order}
              categories={categories}
              onCancel={() => setEditing(null)}
              onSaved={(row) => {
                setItems((prev) => prev.map((i) => (i.id === row.id ? row : i)));
                setEditing(null);
                setToast({ type: "success", message: "Changes saved." });
              }}
            />
          ) : (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
            >
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {item.image_url && <img src={item.image_url} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-secondary">{item.title}</p>
                <p className="text-sm text-slate-500">
                  {item.category} · {formatUgx(item.price_ugx)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  aria-pressed={item.is_featured}
                  onClick={() => toggleFeatured(item)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition",
                    item.is_featured
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <Star className={cn("h-4 w-4", item.is_featured && "fill-current")} aria-hidden="true" />
                  {item.is_featured ? "Featured" : "Feature"}
                </button>
                <button type="button" className={ghostBtn} onClick={() => setEditing(item.id)}>
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${item.title}`}
                  onClick={() => remove(item)}
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
            No items yet. Click Add item to create your first service or product.
          </p>
        )}
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={closeToast} />}
    </div>
  );
}

function OfferingForm({
  item,
  defaultSort,
  categories,
  onSaved,
  onCancel,
}: {
  item: OfferingRow | null;
  defaultSort: number;
  categories: string[];
  onSaved: (row: OfferingRow) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [category, setCategory] = useState(item?.category ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [price, setPrice] = useState(item?.price_ugx != null ? String(item.price_ugx) : "");
  const [features, setFeatures] = useState((item?.features_list ?? []).join("\n"));
  const [featured, setFeatured] = useState(item?.is_featured ?? false);
  const [sort, setSort] = useState(String(defaultSort));
  const [file, setFile] = useState<File | null>(null);
  const [removed, setRemoved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    if (!title.trim()) return setError("Title is required.");

    const priceText = price.replace(/[\s,]/g, "");
    let priceUgx: number | null = null;
    if (priceText) {
      if (!/^\d+$/.test(priceText)) {
        return setError("Price must be a whole number in UGX, for example 8500000. Leave it blank for Get a quote.");
      }
      priceUgx = Number(priceText);
    }

    const sortOrder = Number(sort);
    if (!Number.isFinite(sortOrder)) return setError("Sort order must be a number.");

    setError(null);
    setSaving(true);

    const supabase = createBrowserSupabase();
    const oldUrl = item?.image_url ?? null;
    let imageUrl = oldUrl;
    let uploadedUrl: string | null = null;

    try {
      if (file) {
        uploadedUrl = await uploadImage(file, "services");
        imageUrl = uploadedUrl;
      } else if (removed) {
        imageUrl = null;
      }

      const payload = {
        title: title.trim(),
        category: category.trim() || "General",
        description: description.trim(),
        price_ugx: priceUgx,
        features_list: features
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        is_featured: featured,
        sort_order: Math.round(sortOrder),
        image_url: imageUrl,
      };

      const { data, error: saveError } = item
        ? await supabase.from("services_products").update(payload).eq("id", item.id).select().single()
        : await supabase.from("services_products").insert(payload).select().single();

      if (saveError) throw saveError;

      if (oldUrl && oldUrl !== imageUrl) await deleteImageByUrl(oldUrl);
      await revalidateSite();
      onSaved(data as OfferingRow);
    } catch (err) {
      if (uploadedUrl) await deleteImageByUrl(uploadedUrl); // do not leave an orphan behind
      setError(errorMessage(err));
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-2xl border-2 border-primary/40 bg-white p-6">
      <h2 className="text-lg">{item ? "Edit item" : "New item"}</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <AdminField label="Title" htmlFor="o-title">
          <input id="o-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={adminInput} />
        </AdminField>
        <AdminField label="Category" htmlFor="o-category" hint="Items with the same category are grouped together.">
          <input
            id="o-category"
            type="text"
            list="offering-categories"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={adminInput}
            placeholder="e.g. Solar"
          />
          <datalist id="offering-categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </AdminField>
      </div>

      <AdminField label="Description" htmlFor="o-description">
        <textarea
          id="o-description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={adminInput}
        />
      </AdminField>

      <div className="grid gap-5 sm:grid-cols-2">
        <AdminField
          label="Price (UGX)"
          htmlFor="o-price"
          hint="Whole number, shown as From UGX. Leave blank to show Get a quote."
        >
          <input
            id="o-price"
            type="text"
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={adminInput}
            placeholder="8500000"
          />
        </AdminField>
        <AdminField label="Sort order" htmlFor="o-sort" hint="Lower numbers appear first.">
          <input
            id="o-sort"
            type="number"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className={adminInput}
          />
        </AdminField>
      </div>

      <AdminField label="Features" htmlFor="o-features" hint="One feature per line.">
        <textarea
          id="o-features"
          rows={4}
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          className={adminInput}
        />
      </AdminField>

      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-secondary">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 accent-primary"
        />
        Featured (shown first on the home page and marked Popular)
      </label>

      <ImageField
        currentUrl={item?.image_url ?? null}
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
