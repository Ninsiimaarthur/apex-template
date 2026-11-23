import { createBrowserSupabase } from "@/lib/supabase/client";

export const BUCKET = "site-images";
export const MAX_IMAGE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/** Returns an error message, or null when the file is fine. */
export function validateImage(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return "Please choose a JPG, PNG, WebP or GIF image.";
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) return `Image must be smaller than ${MAX_IMAGE_MB} MB.`;
  return null;
}

/** Uploads to the public bucket and returns the public URL. */
export async function uploadImage(file: File, folder: "services" | "projects" | "hero"): Promise<string> {
  const supabase = createBrowserSupabase();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "31536000", contentType: file.type });
  if (error) throw error;

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

function pathFromPublicUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  return index === -1 ? null : decodeURIComponent(url.slice(index + marker.length));
}

/** Best-effort cleanup of an old image. Never throws. */
export async function deleteImageByUrl(url: string | null | undefined): Promise<void> {
  if (!url) return;
  const path = pathFromPublicUrl(url);
  if (!path) return;
  try {
    await createBrowserSupabase().storage.from(BUCKET).remove([path]);
  } catch {
    // An orphaned file is harmless; do not block the admin's save.
  }
}

export const MAX_VIDEO_MB = 25;
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export function validateVideo(file: File): string | null {
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return "Please choose an MP4, WebM, or MOV video.";
  }
  if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
    return `Video must be smaller than ${MAX_VIDEO_MB} MB.`;
  }
  return null;
}

export async function uploadHeroVideo(file: File): Promise<string> {
  const supabase = createBrowserSupabase();
  const ext = (file.name.split(".").pop() || "mp4").toLowerCase().replace(/[^a-z0-9]/g, "") || "mp4";
  const path = `hero-videos/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "31536000", contentType: file.type });
  if (error) throw error;

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
