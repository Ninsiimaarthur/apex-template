"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { FilterTabs } from "@/components/projects/FilterTabs";
import type { Project } from "@/types/site";

const ALL = "All";

export function ProjectGrid({ categories, items }: { categories: string[]; items: Project[] }) {
  const [active, setActive] = useState(ALL);
  const visible = active === ALL ? items : items.filter((project) => project.category === active);

  return (
    <>
      <FilterTabs options={[ALL, ...categories]} active={active} onChange={setActive} />
      <p className="mt-6 text-center text-sm text-slate-500" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <li
            key={project.id ?? project.title}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative aspect-[4/3] bg-gradient-to-br from-secondary to-secondary/70">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={`${project.title}, ${project.location}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/40">
                  <Icon name="Sun" className="h-14 w-14" />
                  <span className="text-xs">Project photo placeholder</span>
                </div>
              )}
              <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                {project.category}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-lg">{project.title}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                <Icon name="MapPin" className="h-4 w-4" />
                {project.location}
              </p>
              {project.specs && (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary">
                  <Icon name="Zap" className="h-4 w-4" />
                  {project.specs}
                </p>
              )}
              {project.summary && <p className="mt-3 text-slate-600">{project.summary}</p>}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
