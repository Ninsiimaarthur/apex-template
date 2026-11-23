import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
      )}
      <h2 className={cn("text-3xl sm:text-4xl", light && "text-white")}>{title}</h2>
      {subtitle && (
        <p className={cn("mt-4 text-lg", light ? "text-white/80" : "text-slate-600")}>{subtitle}</p>
      )}
    </div>
  );
}
