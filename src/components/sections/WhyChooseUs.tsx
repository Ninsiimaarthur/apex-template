import { getSiteData } from "@/lib/site-data";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";

export async function WhyChooseUs() {
  const { brand, whyChooseUs } = await getSiteData();

  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Why choose us"
          title={`Why customers trust ${brand.name}`}
          subtitle="Honest advice, quality workmanship and a team that shows up when it says it will."
        />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item) => (
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
  );
}
