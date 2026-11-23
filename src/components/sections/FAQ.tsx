import { ChevronDown } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Accordion built on native <details>: accessible, no client JS needed. */
export function FAQ() {
  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        <div className="mt-10 space-y-3">
          {siteConfig.faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-slate-200 bg-white px-5 py-4 open:shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-secondary [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-primary transition group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
