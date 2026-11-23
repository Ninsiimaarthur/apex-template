import Link from "next/link";
import { getSiteData } from "@/lib/site-data";
import { cn, telLink, whatsappLink } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import type { Cta, IconName } from "@/types/site";

type Variant = "solid" | "outline" | "outline-light";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

const variants: Record<Variant, string> = {
  solid: "bg-primary text-white shadow-lg shadow-primary/25 hover:brightness-110",
  outline: "border-2 border-secondary text-secondary hover:bg-secondary hover:text-white",
  "outline-light": "border-2 border-white/70 text-white hover:bg-white hover:text-secondary",
};

const iconFor: Record<Cta["type"], IconName> = {
  whatsapp: "MessageCircle",
  phone: "Phone",
  link: "ArrowRight",
};

export async function CtaButton({
  cta,
  variant = "solid",
  className,
}: {
  cta: Cta;
  variant?: Variant;
  className?: string;
}) {
  const { contact } = await getSiteData();
  const classes = cn(base, variants[variant], className);
  const content = (
    <>
      {cta.type !== "link" && <Icon name={iconFor[cta.type]} className="h-5 w-5" />}
      {cta.label}
      {cta.type === "link" && <Icon name="ArrowRight" className="h-5 w-5" />}
    </>
  );

  if (cta.type === "whatsapp") {
    return (
      <a
        href={whatsappLink(contact.whatsapp, cta.message ?? contact.whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {content}
      </a>
    );
  }
  if (cta.type === "phone") {
    return (
      <a href={telLink(contact.phone)} className={classes}>
        {content}
      </a>
    );
  }
  return (
    <Link href={cta.href} className={classes}>
      {content}
    </Link>
  );
}
