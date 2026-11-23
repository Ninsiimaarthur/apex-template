"use client";

import { cn } from "@/lib/utils";

export function FilterTabs({
  options,
  active,
  onChange,
}: {
  options: string[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div role="group" aria-label="Filter projects" className="flex flex-wrap justify-center gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={active === option}
          onClick={() => onChange(option)}
          className={cn(
            "rounded-full border px-5 py-2 text-sm font-semibold transition",
            active === option
              ? "border-primary bg-primary text-white"
              : "border-slate-300 text-slate-700 hover:border-primary hover:text-primary"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
