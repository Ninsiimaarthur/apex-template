import { OfferingsManager } from "@/components/admin/OfferingsManager";
import { createServerSupabase } from "@/lib/supabase/server";
import type { OfferingRow } from "@/types/db";

export default async function AdminProductsPage() {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("services_products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    return (
      <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
        Could not load products: {error.message}. Have you run supabase/schema.sql?
      </p>
    );
  }

  return <OfferingsManager initial={(data ?? []) as OfferingRow[]} />;
}
