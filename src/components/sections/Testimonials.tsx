import { Star } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Testimonials() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title="What our customers say"
          subtitle="Real feedback from homes and businesses we've powered."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {siteConfig.testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < t.rating ? "h-5 w-5 fill-primary text-primary" : "h-5 w-5 text-slate-300"
                    }
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-slate-700">“{t.quote}”</blockquote>
              <figcaption className="mt-6">
                <p className="font-semibold text-secondary">{t.name}</p>
                <p className="text-sm text-slate-500">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
