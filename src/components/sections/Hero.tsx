import Image from "next/image";
import { getSiteData } from "@/lib/site-data";
import { Container } from "@/components/ui/Container";
import { CtaButton } from "@/components/ui/CtaButton";
import { Icon } from "@/components/ui/Icon";

export async function Hero() {
  const { hero } = await getSiteData();

  return (
    <section className="relative overflow-hidden bg-secondary pb-24 pt-16 text-white sm:pt-20 lg:pb-28">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.35),transparent_60%)]"
      />
      <Container className="relative grid items-center gap-12 lg:grid-cols-2">
        <div>
          {hero.badge && (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium">
              <Icon name="ShieldCheck" className="h-4 w-4 text-accent" />
              {hero.badge}
            </span>
          )}
          <h1 className="mt-5 text-4xl font-extrabold leading-tight !text-white sm:text-5xl">
            {hero.headline}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">{hero.subheadline}</p>

          <ul className="mt-6 space-y-2">
            {hero.bullets.map((b) => (
              <li key={b} className="flex items-center gap-2 text-white/90">
                <Icon name="Check" className="h-5 w-5 shrink-0 text-accent" />
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CtaButton cta={hero.primaryCta} variant="solid" />
            <CtaButton cta={hero.secondaryCta} variant="outline-light" />
          </div>
        </div>

        <div className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5 lg:block">
          {hero.video ? (
            <video
              src={hero.video}
              poster={hero.image || undefined}
              playsInline
              autoPlay
              muted
              loop
              preload="metadata"
              className="h-full w-full object-cover"
            />
          ) : hero.image ? (
            <Image src={hero.image} alt="" fill priority className="object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-white/50">
              <Icon name="Sun" className="h-16 w-16" />
              <span className="text-sm">Hero image placeholder</span>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
