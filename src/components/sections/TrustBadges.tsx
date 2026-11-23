import { siteConfig } from "@/config/siteConfig";
import { Container } from "@/components/ui/Container";

export function TrustBadges() {
  return (
    <section className="relative z-10 -mt-12">
      <Container>
        <dl className="grid grid-cols-1 divide-y divide-slate-100 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {siteConfig.trustBadges.map((badge) => (
            <div key={badge.label} className="flex flex-col px-6 py-6 text-center">
              <dt className="order-2 mt-1 text-sm font-medium text-slate-500">{badge.label}</dt>
              <dd className="text-4xl font-extrabold text-primary">{badge.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
