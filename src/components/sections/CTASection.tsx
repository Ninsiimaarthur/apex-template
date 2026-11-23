import { siteConfig } from "@/config/siteConfig";
import { Container } from "@/components/ui/Container";
import { CtaButton } from "@/components/ui/CtaButton";

export function CTASection() {
  const { cta, hero } = siteConfig;
  return (
    <section className="bg-primary py-16">
      <Container className="text-center">
        <h2 className="text-3xl !text-white sm:text-4xl">{cta.headline}</h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-white/90">{cta.text}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <CtaButton
            cta={hero.primaryCta}
            variant="outline-light"
            className="bg-white !text-secondary hover:bg-white/90"
          />
          <CtaButton cta={hero.secondaryCta} variant="outline-light" />
        </div>
      </Container>
    </section>
  );
}
