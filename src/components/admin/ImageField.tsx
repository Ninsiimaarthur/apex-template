"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ghostBtn } from "@/components/admin/ui";
import { MAX_IMAGE_MB, validateImage } from "@/lib/supabase/storage";

/**
 * Controlled image picker. It never uploads by itself: the parent form uploads
 * the chosen file when the admin clicks Save, so cancelled edits leave no
 * orphaned files in storage.
 */
export function ImageField({
  label = "Photo",
  currentUrl,
  file,
  removed,
  onPick,
  onRemove,
}: {
  label?: string;
  currentUrl: string | null;
  file: File | null;
  removed: boolean;
  onPick: (file: File) => void;
  onRemove: () => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const shown = preview ?? (removed ? null : currentUrl);

  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold text-secondary">{label}</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex h-24 w-36 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400">
          {shown ? <img src={shown} alt="" className="h-full w-full object-cover" /> : "No photo"}
        </div>
        <div className="flex flex-wrap gap-2">
          <label className={cn(ghostBtn, "cursor-pointer focus-within:ring-2 focus-within:ring-primary/30")}>
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
            {shown ? "Replace photo" : "Upload photo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={(event) => {
                const picked = event.target.files?.[0];
                event.target.value = ""; // allow choosing the same file again
                if (!picked) return;
                const problem = validateImage(picked);
                if (problem) {
                  setError(problem);
                  return;
                }
                setError(null);
                onPick(picked);
              }}
            />
          </label>
          {shown && (
            <button type="button" className={ghostBtn} onClick={onRemove}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Remove
            </button>
          )}
        </div>
      </div>
      <p className="mt-1.5 text-xs text-slate-500">JPG, PNG, WebP or GIF, up to {MAX_IMAGE_MB} MB.</p>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
