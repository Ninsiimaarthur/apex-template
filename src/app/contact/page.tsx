import type { Metadata } from "next";
import { getSiteData } from "@/lib/site-data";
import { telLink } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { CtaButton } from "@/components/ui/CtaButton";
import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const { brand } = await getSiteData();
  return {
    title: "Contact & Free Quote",
    description: `Request a free quote from ${brand.name}. Call, WhatsApp or send us a message.`,
  };
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string | string[] }>;
}) {
  const { service } = await searchParams;
  const { contact, hours, services, brand } = await getSiteData();

  // /contact?service=<slug> pre-selects the service from the Services page
  const slug = typeof service === "string" ? service : undefined;
  const defaultService = services.find((s) => s.slug === slug)?.title ?? "";
  const serviceOptions = Array.from(new Set(services.map((s) => s.title)));
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`;

  return (
    <>
      <PageHeader
        eyebrow="Contact us"
        title="Get your free quote"
        subtitle="Tell us what you need and we'll reply with a fixed written quote within 48 hours."
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl">Send us a message</h2>
              <p className="mb-6 mt-2">Fill in the form and we&apos;ll get back to you shortly.</p>
              <ContactForm defaultService={defaultService} serviceOptions={serviceOptions} />
            </div>
          </div>

          {/* Side column */}
          <aside className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl bg-secondary p-6 text-white">
              <h2 className="text-xl !text-white">Prefer to chat?</h2>
              <p className="mt-2 text-white/80">WhatsApp is the fastest way to reach us.</p>
              <div className="mt-5 flex flex-col gap-3">
                <CtaButton cta={{ label: "Chat on WhatsApp", type: "whatsapp" }} />
                <CtaButton cta={{ label: `Call ${contact.phone}`, type: "phone" }} variant="outline-light" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <h2 className="text-xl">Contact details</h2>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <Icon name="Phone" className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <a href={telLink(contact.phone)} className="hover:text-primary">
                    {contact.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Mail" className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <a href={`mailto:${contact.email}`} className="break-all hover:text-primary">
                    {contact.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="MapPin" className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{contact.address}</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <h2 className="flex items-center gap-2 text-xl">
                <Icon name="Clock" className="h-5 w-5 text-primary" />
                Opening hours
              </h2>
              <ul className="mt-4 space-y-2 text-sm">
                {hours.map((h) => (
                  <li key={h.days} className="flex justify-between gap-4">
                    <span className="font-medium text-secondary">{h.days}</span>
                    <span className="text-right">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              {contact.mapEmbedUrl ? (
                <iframe
                  src={contact.mapEmbedUrl}
                  title={`Map showing ${brand.name} location`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-64 w-full border-0"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-64 flex-col items-center justify-center gap-2 bg-slate-100 px-6 text-center text-slate-500">
                  <Icon name="MapPin" className="h-10 w-10 text-primary" />
                  <p className="text-sm font-medium text-secondary">Map placeholder</p>
                  <p className="text-xs">Paste a Google Maps embed URL into contact.mapEmbedUrl in siteConfig.ts</p>
                </div>
              )}
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border-t border-slate-200 px-4 py-3 text-sm font-semibold text-primary hover:bg-slate-50"
              >
                Get directions <Icon name="ArrowRight" className="h-4 w-4" />
              </a>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
