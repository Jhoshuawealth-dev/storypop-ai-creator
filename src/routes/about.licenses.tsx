import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/about/licenses")({
  head: pageHead("Licenses", "Open source licenses used by Storypop AI."),
  component: Licenses,
});

const licenseBlurbs: Record<string, string> = {
  MIT: "Permission is granted to use, copy, modify and distribute this software, provided the copyright notice and licence are included.",
  ISC: "A permissive licence functionally equivalent to MIT, requiring preservation of the copyright notice.",
  "Apache-2.0": "A permissive licence that also grants an express patent licence from contributors to users.",
  "SIL OFL 1.1": "Fonts may be used, studied, modified and redistributed freely, as long as they are not sold by themselves.",
};

const groups = [
  {
    title: "Framework & UI",
    items: [
      { name: "React", license: "MIT" },
      { name: "TanStack Router & Query", license: "MIT" },
      { name: "Tailwind CSS", license: "MIT" },
      { name: "Lucide Icons", license: "ISC" },
      { name: "Recharts", license: "MIT" },
    ],
  },
  {
    title: "Fonts",
    items: [
      { name: "Sora", license: "SIL OFL 1.1" },
      { name: "Manrope", license: "SIL OFL 1.1" },
    ],
  },
  {
    title: "Tooling",
    items: [
      { name: "Vite", license: "MIT" },
      { name: "TypeScript", license: "Apache-2.0" },
      { name: "Sonner", license: "MIT" },
    ],
  },
];

function Licenses() {
  return (
    <AppShell title="Open Source Licenses" showBack backTo="/about">
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Storypop AI is built on amazing open source software. Thank you to all the maintainers.
      </p>

      {groups.map((group) => (
        <div key={group.title}>
          <SectionHeader title={group.title} />
          <div className="divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-card">
            {group.items.map((item) => (
              <button
                key={item.name}
                onClick={() => toast.info(`${item.name} license opens here`)}
                className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left"
              >
                <span className="min-w-0 flex-1 truncate font-semibold text-foreground">{item.name}</span>
                <span className="shrink-0 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-bold text-primary">
                  {item.license}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      ))}
    </AppShell>
  );
}
