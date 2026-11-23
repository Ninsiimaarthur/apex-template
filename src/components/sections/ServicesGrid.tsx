import Image from "next/image";
import Link from "next/link";
import { getSiteData } from "@/lib/site-data";
import { formatUgx, iconForCategory } from "@/lib/offering";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";

const MAX_ITEMS = 6;

export async function ServicesGrid() {
  const { services } = await getSiteData();
  if (services.length === 0) return null;

  // Featured items first, then fill up to MAX_ITEMS with the rest (sort order kept).
  const items = [
    ...services.filter((s) => s.isFeatured),
    ...services.filter((s) => !s.isFeatured),
  ].slice(0, MAX_ITEMS);

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="What we do"
          title="Services built around your needs"
          subtitle="Whether it's a single socket or a full solar system, we handle it start to finish."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <Link
              key={s.slug}
              href={`/services#${s.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              {s.imageUrl && (
                <div className="relative aspect-[16/10] bg-slate-100">
                  <Image
                    src={s.imageUrl}
                    alt={s.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                {!s.imageUrl && (
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                    <Icon name={iconForCategory(s.category)} className="h-6 w-6" />
                  </span>
                )}
                <h3 className={s.imageUrl ? "text-xl" : "mt-5 text-xl"}>{s.title}</h3>
                <p className="mt-1 text-sm font-semibold text-primary">{formatUgx(s.priceUgx)}</p>
                <p className="mt-2 line-clamp-3 flex-1 text-slate-600">{s.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Learn more <Icon name="ArrowRight" className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 font-semibold text-secondary underline-offset-4 hover:text-primary hover:underline"
          >
            View all services <Icon name="ArrowRight" className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
