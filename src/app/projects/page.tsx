import type { Metadata } from "next";
import { getSiteData } from "@/lib/site-data";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { CTASection } from "@/components/sections/CTASection";

export async function generateMetadata(): Promise<Metadata> {
  const { brand } = await getSiteData();
  return {
    title: "Projects",
    description: `Recent solar and electrical installations completed by ${brand.name}.`,
  };
}

export default async function ProjectsPage() {
  const { projects } = await getSiteData();

  return (
    <>
      <PageHeader
        eyebrow="Our work"
        title="Recent projects"
        subtitle="A selection of homes and businesses we've powered. Filter by type to see what's closest to your project."
      />
      <section className="py-16 sm:py-20">
        <Container>
          <ProjectGrid categories={projects.categories} items={projects.items} />
        </Container>
      </section>
      <CTASection />
    </>
  );
}
