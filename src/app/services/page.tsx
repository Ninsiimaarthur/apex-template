import type { Metadata } from "next";
import Image from "next/image";
import { getSiteData } from "@/lib/site-data";
import { formatUgx, iconForCategory } from "@/lib/offering";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { CtaButton } from "@/components/ui/CtaButton";
import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/ui/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import type { Offering } from "@/types/site";

export async function generateMetadata(): Promise<Metadata> {
  const { brand } = await getSiteData();
  return {
    title: "Services",
    description: `Solar installation, electrical wiring, backup power and maintenance from ${brand.name}.`,
  };
}

export default async function ServicesPage() {
  const { services, brand } = await getSiteData();

  // Group by category, keeping the admin's sort order.
  const groups = new Map<string, Offering[]>();
  for (const service of services) {
    groups.set(service.category, [...(groups.get(service.category) ?? []), service]);
  }

  return (
    <>
      <PageHeader
        eyebrow="Our services"
        title="Solar & electrical services"
        subtitle="Clear scope, fixed written quotes and certified workmanship on every job."
      />

      {groups.size === 0 && (
        <section className="py-20">
          <Container className="text-center">
            <p className="text-lg">Our service list is being updated. Please contact us for a quote.</p>
          </Container>
        </section>
      )}

      {Array.from(groups.entries()).map(([category, items], index) => (
        <section key={category} className={cn("py-16 sm:py-20", index % 2 === 1 && "bg-slate-50")}>
          <Container>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon name={iconForCategory(category)} className="h-6 w-6" />
              </span>
              <h2 className="text-3xl">{category}</h2>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((service) => (
                <article
                  key={service.slug}
                  id={service.slug}
                  className={cn(
                    "flex scroll-mt-24 flex-col overflow-hidden rounded-2xl border bg-white",
                    service.isFeatured
                      ? "border-primary shadow-lg ring-1 ring-primary"
                      : "border-slate-200 shadow-sm"
                  )}
                >
                  {service.imageUrl && (
                    <div className="relative aspect-[16/10] bg-slate-100">
                      <Image
                        src={service.imageUrl}
                        alt={service.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {service.isFeatured && (
                      <span className="mb-3 inline-block self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        Popular
                      </span>
                    )}
                    <h3 className="text-xl">{service.title}</h3>
                    <p className="mt-2 text-lg font-extrabold text-secondary">{formatUgx(service.priceUgx)}</p>
                    <p className="mt-2 text-sm text-slate-600">{service.description}</p>
                    {service.features.length > 0 && (
                      <ul className="mt-4 flex-1 space-y-2 text-sm">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <Icon name="Check" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-6 flex flex-col gap-3">
                      <CtaButton
                        cta={{
                          label: "Request a Quote",
                          type: "link",
                          href: `/contact?service=${encodeURIComponent(service.slug)}`,
                        }}
                        variant={service.isFeatured ? "solid" : "outline"}
                        className="w-full"
                      />
                      <CtaButton
                        cta={{
                          label: "WhatsApp Us",
                          type: "whatsapp",
                          message: `Hi ${brand.name}, I'd like a quote for ${service.title}.`,
                        }}
                        variant="outline"
                        className="w-full"
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>
      ))}

      <Container className="pb-12 text-center">
        <p className="text-sm text-slate-500">
          Prices are indicative and confirmed after a free site survey.
        </p>
      </Container>

      <CTASection />
    </>
  );
}
