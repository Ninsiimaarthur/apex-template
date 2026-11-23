import { siteConfig } from "@/config/siteConfig";
import { BusinessInfoForm } from "@/components/admin/BusinessInfoForm";
import { createServerSupabase } from "@/lib/supabase/server";
import type { SiteSettingsRow } from "@/types/db";

export default async function AdminBusinessInfoPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  const row = data as SiteSettingsRow | null;

  const initial: SiteSettingsRow = {
    id: 1,
    business_name: row?.business_name ?? siteConfig.brand.name,
    tagline: row?.tagline ?? siteConfig.brand.tagline,
    phone: row?.phone ?? siteConfig.contact.phone,
    whatsapp: row?.whatsapp ?? siteConfig.contact.whatsapp,
    email: row?.email ?? siteConfig.contact.email,
    address: row?.address ?? siteConfig.contact.address,
    hours: Array.isArray(row?.hours) && row.hours.length > 0 ? row.hours : siteConfig.hours,
    hero_title: row?.hero_title ?? siteConfig.hero.headline,
    hero_subtitle: row?.hero_subtitle ?? siteConfig.hero.subheadline,
    primary_color: row?.primary_color ?? "#f97316",
    secondary_color: row?.secondary_color ?? "#1e293b",
    accent_color: row?.accent_color ?? "#22c55e",
  };

  return (
    <div>
      <h1 className="text-2xl">Business Info</h1>
      <p className="mb-6 mt-1 text-sm text-slate-500">
        These details appear in the navbar, footer, contact page, WhatsApp buttons, brand colors and home page hero.
      </p>
      <BusinessInfoForm initial={initial} />
    </div>
  );
}
