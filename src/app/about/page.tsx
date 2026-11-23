import type { Metadata } from "next";
import Image from "next/image";
import { getSiteData } from "@/lib/site-data";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTASection } from "@/components/sections/CTASection";

export async function generateMetadata(): Promise<Metadata> {
  const { brand } = await getSiteData();
  return {
    title: "About Us",
    description: `Meet the team behind ${brand.name}: our story, values, licensing and safety standards.`,
  };
}

export default async function AboutPage() {
  const { brand, about, trustBadges } = await getSiteData();

  return (
    <>
      <PageHeader eyebrow="About us" title={`The team behind ${brand.name}`} subtitle={brand.tagline} />

      {/* Story */}
      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading align="left" eyebrow="Our story" title="Built on honest, careful work" />
            <div className="mt-6 space-y-4 text-lg">
              {about.story.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <dl className="grid gap-4 sm:grid-cols-3">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex flex-col rounded-2xl border border-slate-200 p-6 text-center shadow-sm"
              >
                <dt className="order-2 mt-1 text-sm font-medium text-slate-500">{badge.label}</dt>
                <dd className="text-4xl font-extrabold text-primary">{badge.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Mission */}
      <section className="bg-secondary py-16 text-white">
        <Container className="max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Our mission</p>
          <p className="mt-4 text-2xl font-semibold leading-relaxed sm:text-3xl">{about.mission}</p>
        </Container>
      </section>

      {/* Values */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Core values"
            title="What we stand for"
            subtitle="The principles behind every quote, install and handover."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {about.values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon name={value.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl">{value.title}</h3>
                <p className="mt-2 text-slate-600">{value.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Safety & licensing */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Safety & licensing"
            title="Certified, insured and compliant"
            subtitle="Electrical work has to be done safely. Here's how we protect you and your property."
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {about.credentials.map((item) => (
              <div key={item.title} className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-white">
                  <Icon name={item.icon} className="h-7 w-7" />
                </span>
                <h3 className="mt-5 text-lg">{item.title}</h3>
                <p className="mt-2 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Our team"
            title="Meet the people you'll work with"
            subtitle="Certified engineers and a support team who pick up the phone."
          />
          <ul className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {about.team.map((member) => (
              <li key={member.name} className="text-center">
                <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-2xl bg-secondary/10">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-full w-full items-center justify-center text-6xl font-bold text-primary/60"
                    >
                      {member.name.charAt(0)}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-lg font-semibold text-secondary">{member.name}</p>
                <p className="text-sm text-slate-500">{member.role}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
