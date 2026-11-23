import type { IconName } from "@/types/site";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "From UGX 8,500,000", or "Get a quote" when there is no price. */
export function formatUgx(amount: number | null): string {
  return amount === null ? "Get a quote" : `From UGX ${amount.toLocaleString("en-US")}`;
}

/** Services have no icon column, so one is chosen from the category name. */
export function iconForCategory(category: string): IconName {
  const c = category.toLowerCase();
  if (c.includes("solar")) return "Sun";
  if (c.includes("backup") || c.includes("battery")) return "BatteryCharging";
  if (c.includes("electric") || c.includes("wiring")) return "Zap";
  if (c.includes("maint") || c.includes("repair")) return "Wrench";
  if (c.includes("commercial")) return "Building2";
  if (c.includes("audit") || c.includes("energy")) return "Gauge";
  return "Lightbulb";
}
