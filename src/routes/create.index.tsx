import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderOpen, LayoutTemplate, Package, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/create/")({
  head: pageHead("Create", "Start a new AI-powered UGC video."),
  component: CreateStart,
});

const options = [
  {
    to: "/create/idea",
    icon: Sparkles,
    title: "Start from Idea",
    desc: "Describe what you want and let AI write the script.",
    featured: true,
  },
  { to: "/create/idea", icon: Package, title: "From Product", desc: "Turn a product into a promo video." },
  { to: "/create/idea", icon: LayoutTemplate, title: "From Template", desc: "Use a proven UGC video structure." },
  { to: "/projects", icon: FolderOpen, title: "From Existing Project", desc: "Remix a video you already made." },
] as const;

function CreateStart() {
  return (
    <AppShell title="Create" subtitle="Step 1 of 7">
      <div className="pt-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
          How do you want to create today?
        </h1>
        <p className="mt-1.5 text-[15px] text-muted-foreground">
          Pick a starting point — you can change everything later.
        </p>
      </div>

      <div className="mt-6 space-y-3.5">
        {options.map((o, i) => (
          <Link
            key={i}
            to={o.to}
            className={
              "featured" in o && o.featured
                ? "flex items-center gap-4 rounded-3xl bg-primary-deep p-5 text-primary-foreground shadow-fab transition-transform active:scale-[0.98]"
                : "flex items-center gap-4 rounded-3xl bg-card p-5 shadow-card transition-transform active:scale-[0.98]"
            }
          >
            <span
              className={
                "featured" in o && o.featured
                  ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
                  : "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary"
              }
            >
              <o.icon className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-[17px] font-bold">{o.title}</span>
              <span
                className={
                  "featured" in o && o.featured
                    ? "mt-0.5 block text-sm leading-snug text-primary-light"
                    : "mt-0.5 block text-sm leading-snug text-muted-foreground"
                }
              >
                {o.desc}
              </span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-7 rounded-2xl border-2 border-dashed border-primary-light bg-primary-soft/60 p-4">
        <p className="text-sm font-bold text-secondary-foreground">Your creation journey</p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          Idea → Script → Scenes → Character → Voice → Style → Generate → Edit → Publish
        </p>
      </div>
    </AppShell>
  );
}
