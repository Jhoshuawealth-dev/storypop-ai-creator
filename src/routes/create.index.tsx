import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderOpen, LayoutTemplate, Package, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";
import { Send } from "lucide-react";

export const Route = createFileRoute("/create/")({
  head: pageHead("Create Video", "Start a new AI-powered video."),
  component: CreateStart,
});

const options = [
  {
    to: "/create/idea",
    icon: Sparkles,
    search: { mode: "idea" },
    title: "Start from Idea",
    desc: "Describe what you want and let AI write the script.",
    featured: true,
  },
  { to: "/create/idea", search: { mode: "product" }, icon: Package, title: "From Product", desc: "Paste a product link or describe what you sell. AI pulls out the benefits and pain points and writes a demo or unboxing video." },
  { to: "/create/idea", search: { mode: "template" }, icon: LayoutTemplate, title: "From Template", desc: "Start from a proven video structure — Problem → Solution, 3-second hook, Before & After, Review or Tutorial." },
  { to: "/projects", search: {}, icon: FolderOpen, title: "From Existing Project", desc: "Open a draft you didn't finish, or remix a video you already completed." },
] as const;

function CreateStart() {
  const { preferences, hydrated } = useApp();
  const needsDefaults = hydrated && !preferences["pub.time"];
  return (
    <AppShell title="Create Video" subtitle="Step 1 of 7">
      {needsDefaults && (
        <Link to="/settings/publishing" className="mt-5 flex items-center gap-3 rounded-2xl border-2 border-primary bg-primary-soft p-4">
          <Send className="h-5 w-5 shrink-0 text-primary" />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-foreground">Set up your publishing defaults first</span>
            <span className="block text-xs text-muted-foreground">Add your usual hashtags, caption ending and posting time once — every video will use them.</span>
          </span>
        </Link>
      )}
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
            search={"search" in o ? o.search : {}}
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
