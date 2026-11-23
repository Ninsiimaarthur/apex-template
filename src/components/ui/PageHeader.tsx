import { Container } from "@/components/ui/Container";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-secondary py-16 text-white sm:py-20">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.35),transparent_60%)]"
      />
      <Container className="relative">
        {eyebrow && (
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
        )}
        <h1 className="text-4xl font-extrabold !text-white sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-white/80">{subtitle}</p>}
      </Container>
    </section>
  );
}
