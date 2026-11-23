import { cache } from "react";
import { siteConfig } from "@/config/siteConfig";
import { slugify } from "@/lib/offering";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";
import type { OfferingRow, ProjectRow, SiteSettingsRow } from "@/types/db";
import type { Offering, Project, SiteConfig } from "@/types/site";

export type BrandColors = {
  primaryHex: string;
  secondaryHex: string;
  accentHex: string;
};

export const DEFAULT_BRAND_COLORS: BrandColors = {
  primaryHex: "#f97316",
  secondaryHex: "#1e293b",
  accentHex: "#22c55e",
};

function normalizeHex(value: string | undefined | null, fallback: string): string {
  if (!value) return fallback;
  const trimmed = value.trim();
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  if (/^#[0-9a-fA-F]{6}$/.test(withHash)) return withHash.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(withHash)) {
    const [, r, g, b] = withHash;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return fallback;
}

export function hexToHslTriplet(hex: string, fallbackTriplet: string): string {
  const normalized = normalizeHex(hex, "");
  if (!normalized) return fallbackTriplet;

  const r = parseInt(normalized.slice(1, 3), 16) / 255;
  const g = parseInt(normalized.slice(3, 5), 16) / 255;
  const b = parseInt(normalized.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  return `${h} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function toOfferings(rows: OfferingRow[]): Offering[] {
  const seen = new Map<string, number>();
  return rows.map((row) => {
    const base = slugify(row.title) || row.id.slice(0, 8);
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    return {
      id: row.id,
      slug: count === 1 ? base : `${base}-${count}`,
      title: row.title,
      category: row.category || "General",
      description: row.description ?? "",
      priceUgx: row.price_ugx === null ? null : Number(row.price_ugx),
      features: row.features_list ?? [],
      imageUrl: row.image_url,
      isFeatured: row.is_featured,
    };
  });
}

function toProjects(rows: ProjectRow[]): Project[] {
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category || "General",
    location: row.location ?? "",
    specs: row.specs ?? undefined,
    summary: row.summary ?? undefined,
    image: row.image_url ?? undefined,
  }));
}

export type SiteDataResult = SiteConfig & {
  colors: BrandColors;
};

export const getSiteData = cache(async (): Promise<SiteDataResult> => {
  const defaultResult: SiteDataResult = {
    ...siteConfig,
    colors: DEFAULT_BRAND_COLORS,
  };

  if (!isSupabaseConfigured) return defaultResult;

  try {
    const supabase = createPublicClient();
    const [settingsRes, servicesRes, projectsRes] = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      supabase
        .from("services_products")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("title", { ascending: true }),
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
    ]);

    if (settingsRes.error) console.error("[site-data] site_settings:", settingsRes.error.message);
    if (servicesRes.error) console.error("[site-data] services_products:", servicesRes.error.message);
    if (projectsRes.error) console.error("[site-data] projects:", projectsRes.error.message);

    const s = (settingsRes.error ? null : settingsRes.data) as SiteSettingsRow | null;
    const services = servicesRes.error ? null : (servicesRes.data as OfferingRow[]);
    const projects = projectsRes.error ? null : toProjects(projectsRes.data as ProjectRow[]);

    return {
      ...siteConfig,
      brand: {
        ...siteConfig.brand,
        name: s?.business_name || siteConfig.brand.name,
        tagline: s?.tagline || siteConfig.brand.tagline,
      },
      contact: {
        ...siteConfig.contact,
        phone: s?.phone || siteConfig.contact.phone,
        whatsapp: s?.whatsapp ? s.whatsapp.replace(/\D/g, "") : siteConfig.contact.whatsapp,
        email: s?.email || siteConfig.contact.email,
        address: s?.address || siteConfig.contact.address,
      },
      hours: s && Array.isArray(s.hours) && s.hours.length > 0 ? s.hours : siteConfig.hours,
      hero: {
        ...siteConfig.hero,
        headline: s?.hero_title || siteConfig.hero.headline,
        subheadline: s?.hero_subtitle || siteConfig.hero.subheadline,
        image: s?.hero_image_url !== undefined ? (s.hero_image_url ?? undefined) : siteConfig.hero.image,
        video: s?.hero_video_url !== undefined ? (s.hero_video_url ?? undefined) : siteConfig.hero.video,
      },
      colors: {
        primaryHex: normalizeHex(s?.primary_color, DEFAULT_BRAND_COLORS.primaryHex),
        secondaryHex: normalizeHex(s?.secondary_color, DEFAULT_BRAND_COLORS.secondaryHex),
        accentHex: normalizeHex(s?.accent_color, DEFAULT_BRAND_COLORS.accentHex),
      },
      whyChooseUs:
        s && Array.isArray(s.why_choose_us) && s.why_choose_us.length > 0
          ? s.why_choose_us
          : siteConfig.whyChooseUs,
      testimonials:
        s && Array.isArray(s.testimonials) && s.testimonials.length > 0
          ? s.testimonials
          : siteConfig.testimonials,
      faqs:
        s && Array.isArray(s.faqs) && s.faqs.length > 0
          ? s.faqs
          : siteConfig.faqs,
      services: services ? toOfferings(services) : siteConfig.services,
      projects: projects
        ? { categories: Array.from(new Set(projects.map((p) => p.category))), items: projects }
        : siteConfig.projects,
    };
  } catch (error) {
    console.error("[site-data] Supabase unavailable, using siteConfig fallback:", error);
    return defaultResult;
  }
});
