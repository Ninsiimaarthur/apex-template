"use client";

import { useCallback, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { revalidateSite } from "@/app/admin/actions";
import { AdminField, adminInput, errorMessage, ghostBtn, primaryBtn } from "@/components/admin/ui";
import { Toast } from "@/components/forms/Toast";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { deleteImageByUrl, uploadImage } from "@/lib/supabase/storage";
import type { SiteSettingsRow, WhyChooseUsItemDb, TestimonialItemDb, FaqItemDb } from "@/types/db";

type Values = {
  business_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hero_title: string;
  hero_subtitle: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
};
type Hours = { days: string; time: string };

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

function sanitizeHexForPicker(val: string, fallback: string): string {
  const trimmed = val.trim();
  const prefixed = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  return HEX_RE.test(prefixed) ? prefixed : fallback;
}

export function BusinessInfoForm({ initial }: { initial: SiteSettingsRow }) {
  const [values, setValues] = useState<Values>({
    business_name: initial.business_name,
    tagline: initial.tagline,
    phone: initial.phone,
    whatsapp: initial.whatsapp,
    email: initial.email,
    address: initial.address,
    hero_title: initial.hero_title,
    hero_subtitle: initial.hero_subtitle,
    primary_color: sanitizeHexForPicker(initial.primary_color ?? "#f97316", "#f97316"),
    secondary_color: sanitizeHexForPicker(initial.secondary_color ?? "#1e293b", "#1e293b"),
    accent_color: sanitizeHexForPicker(initial.accent_color ?? "#22c55e", "#22c55e"),
  });
  const [hours, setHours] = useState<Hours[]>(
    initial.hours.length > 0 ? initial.hours : [{ days: "", time: "" }]
  );
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(initial.hero_image_url ?? null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroRemoved, setHeroRemoved] = useState(false);
  const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseUsItemDb[]>(
    initial.why_choose_us && initial.why_choose_us.length > 0
      ? initial.why_choose_us
      : [{ title: "", text: "", icon: "ShieldCheck" }]
  );
  const [testimonials, setTestimonials] = useState<TestimonialItemDb[]>(
    initial.testimonials && initial.testimonials.length > 0
      ? initial.testimonials
      : [{ name: "", role: "", quote: "", rating: 5 }]
  );
  const [faqs, setFaqs] = useState<FaqItemDb[]>(
    initial.faqs && initial.faqs.length > 0 ? initial.faqs : [{ question: "", answer: "" }]
  );
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  const bind = (key: keyof Values) => ({
    id: key,
    value: values[key],
    className: adminInput,
    "aria-invalid": Boolean(errors[key]),
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((current) => ({ ...current, [key]: event.target.value })),
  });

  const bindColor = (key: "primary_color" | "secondary_color" | "accent_color", fallback: string) => ({
    pickerValue: sanitizeHexForPicker(values[key], fallback),
    onPick: (hex: string) =>
      setValues((current) => ({ ...current, [key]: hex.toLowerCase() })),
  });

  function updateHours(index: number, key: keyof Hours, value: string) {
    setHours((rows) => rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof Values, string>> = {};
    if (!values.business_name.trim()) next.business_name = "Business name is required.";
    if (!values.phone.trim()) next.phone = "Phone number is required.";
    const whatsapp = values.whatsapp.replace(/\D/g, "");
    if (whatsapp && (whatsapp.length < 8 || whatsapp.length > 15)) {
      next.whatsapp = "Use the full number with country code, e.g. 256700000000.";
    }
    if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!HEX_RE.test(values.primary_color.trim())) {
      next.primary_color = "Use a 6-digit hex color like #f97316.";
    }
    if (!HEX_RE.test(values.secondary_color.trim())) {
      next.secondary_color = "Use a 6-digit hex color like #1e293b.";
    }
    if (!HEX_RE.test(values.accent_color.trim())) {
      next.accent_color = "Use a 6-digit hex color like #22c55e.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || !validate()) return;

    setSaving(true);
    const oldHeroUrl = initial.hero_image_url ?? null;
    let nextHeroUrl: string | null = heroRemoved ? null : heroImageUrl;
    let uploadedUrl: string | null = null;
    try {
      if (heroFile) {
        uploadedUrl = await uploadImage(heroFile, "hero");
        nextHeroUrl = uploadedUrl;
      }
      const supabase = createBrowserSupabase();
      const { error } = await supabase
        .from("site_settings")
        .upsert({
          id: 1,
          business_name: values.business_name.trim(),
          tagline: values.tagline.trim(),
          phone: values.phone.trim(),
          whatsapp: values.whatsapp.replace(/\D/g, ""),
          email: values.email.trim(),
          address: values.address.trim(),
          hours: hours
            .map((h) => ({ days: h.days.trim(), time: h.time.trim() }))
            .filter((h) => h.days && h.time),
          hero_title: values.hero_title.trim(),
          hero_subtitle: values.hero_subtitle.trim(),
          primary_color: values.primary_color.trim().toLowerCase(),
          secondary_color: values.secondary_color.trim().toLowerCase(),
          accent_color: values.accent_color.trim().toLowerCase(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      if (oldHeroUrl && oldHeroUrl !== nextHeroUrl) {
        await deleteImageByUrl(oldHeroUrl);
      }
      setHeroImageUrl(nextHeroUrl);
      setHeroFile(null);
      setHeroRemoved(false);
      if (oldHeroUrl && oldHeroUrl !== nextHeroUrl) {
        await deleteImageByUrl(oldHeroUrl);
      }
      await revalidateSite();
      setToast({ type: "success", message: "Business info & colors saved. Your website is updated." });
    } catch (error) {
      if (uploadedUrl) await deleteImageByUrl(uploadedUrl);
      setToast({ type: "error", message: errorMessage(error) });
    } finally {
      setSaving(false);
    }
  }

  const primary = bindColor("primary_color", "#f97316");
  const secondary = bindColor("secondary_color", "#1e293b");
  const accent = bindColor("accent_color", "#22c55e");

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="space-y-8">
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg">Company</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminField label="Business name" htmlFor="business_name" error={errors.business_name}>
              <input type="text" {...bind("business_name")} />
            </AdminField>
            <AdminField label="Tagline" htmlFor="tagline">
              <input type="text" {...bind("tagline")} />
            </AdminField>
          </div>
        </section>

        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg">Brand colors</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            <AdminField
              label="Primary color"
              htmlFor="primary_color"
              error={errors.primary_color}
              hint="Buttons, highlights and links"
            >
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  aria-label="Pick primary color"
                  value={primary.pickerValue}
                  onChange={(e) => primary.onPick(e.target.value)}
                  className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                />
                <input type="text" placeholder="#f97316" {...bind("primary_color")} />
              </div>
            </AdminField>

            <AdminField
              label="Secondary color"
              htmlFor="secondary_color"
              error={errors.secondary_color}
              hint="Dark headings, hero and footer"
            >
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  aria-label="Pick secondary color"
                  value={secondary.pickerValue}
                  onChange={(e) => secondary.onPick(e.target.value)}
                  className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                />
                <input type="text" placeholder="#1e293b" {...bind("secondary_color")} />
              </div>
            </AdminField>

            <AdminField
              label="Accent color"
              htmlFor="accent_color"
              error={errors.accent_color}
              hint="Badges and supporting accents"
            >
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  aria-label="Pick accent color"
                  value={accent.pickerValue}
                  onChange={(e) => accent.onPick(e.target.value)}
                  className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                />
                <input type="text" placeholder="#22c55e" {...bind("accent_color")} />
              </div>
            </AdminField>
          </div>
        </section>

        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg">Contact</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminField label="Phone" htmlFor="phone" error={errors.phone}>
              <input type="tel" placeholder="+256 700 000 000" {...bind("phone")} />
            </AdminField>
            <AdminField
              label="WhatsApp number"
              htmlFor="whatsapp"
              error={errors.whatsapp}
              hint="Digits only, with country code and no plus sign."
            >
              <input type="tel" placeholder="256700000000" {...bind("whatsapp")} />
            </AdminField>
            <AdminField label="Email" htmlFor="email" error={errors.email}>
              <input type="email" {...bind("email")} />
            </AdminField>
            <AdminField label="Address" htmlFor="address">
              <input type="text" {...bind("address")} />
            </AdminField>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg">Opening hours</h2>
          {hours.map((row, index) => (
            <div key={index} className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                aria-label={`Days, row ${index + 1}`}
                placeholder="Mon – Fri"
                value={row.days}
                onChange={(e) => updateHours(index, "days", e.target.value)}
                className={adminInput}
              />
              <input
                type="text"
                aria-label={`Hours, row ${index + 1}`}
                placeholder="8:00 AM – 6:00 PM"
                value={row.time}
                onChange={(e) => updateHours(index, "time", e.target.value)}
                className={adminInput}
              />
              <button
                type="button"
                aria-label={`Remove row ${index + 1}`}
                onClick={() => setHours((rows) => rows.filter((_, i) => i !== index))}
                className="shrink-0 rounded-lg p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
          <button
            type="button"
            className={ghostBtn}
            onClick={() => setHours((rows) => [...rows, { days: "", time: "" }])}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add row
          </button>
        </section>

        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg">Home page hero text</h2>
          <AdminField label="Headline" htmlFor="hero_title">
            <input type="text" {...bind("hero_title")} />
          </AdminField>
          <AdminField label="Sub-headline" htmlFor="hero_subtitle">
            <textarea rows={3} {...bind("hero_subtitle")} />
          </AdminField>
        </section>

        <button type="submit" disabled={saving} className={primaryBtn}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </form>

      {toast && <Toast type={toast.type} message={toast.message} onClose={closeToast} />}
    </>
  );
}
