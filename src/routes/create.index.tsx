import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderOpen, LayoutTemplate, Package, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";
import { Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, SelectField, TextArea } from "@/components/ui/input";

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
  if (!hydrated) return <AppShell title="Create Video" subtitle="Step 1 of 7"><div className="pt-6" /></AppShell>;
  if (!preferences["pub.time"]) return <AppShell title="Create Video" subtitle="Step 1 of 7"><PublishingDefaultsPopup /></AppShell>;
  return (
    <AppShell title="Create Video" subtitle="Step 1 of 7">
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

const times = ["Best time (AI suggested)", "Morning (8–10 AM)", "Afternoon (12–2 PM)", "Evening (6–9 PM)"];
const zones = ["Africa/Lagos (WAT)", "Europe/London", "America/New_York", "America/Los_Angeles", "Asia/Dubai"];

function PublishingDefaultsPopup() {
  const { preferences, updatePreference } = useApp();
  const [time, setTime] = useState(String(preferences["pub.time"] || times[0]));
  const [zone, setZone] = useState(String(preferences["pub.timezone"] || zones[0]));
  const [caption, setCaption] = useState(String(preferences["pub.caption"] ?? ""));
  const [tags, setTags] = useState(String(preferences["pub.hashtags"] ?? ""));
  const [seo, setSeo] = useState(preferences["pub.seo"] !== false);

  const save = () => {
    updatePreference("pub.caption", caption.trim());
    updatePreference("pub.hashtags", tags.trim());
    updatePreference("pub.timezone", zone);
    updatePreference("pub.seo", seo);
    updatePreference("pub.time", time);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="pub-title">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-card p-6 shadow-fab sm:rounded-3xl">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary"><Send className="h-5 w-5" /></span>
        <h2 id="pub-title" className="mt-4 font-display text-xl font-extrabold text-foreground">Set up your publishing defaults</h2>
        <p className="mt-1 text-sm text-muted-foreground">Do this once — every video you create will use these. You can change them later in Settings.</p>
        <div className="mt-5 space-y-4">
          <Field label="Preferred posting time"><SelectField options={times} value={time} onChange={setTime} /></Field>
          <Field label="Time zone"><SelectField options={zones} value={zone} onChange={setZone} /></Field>
          <Field label="Default caption ending"><TextArea rows={2} className="min-h-20" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. Follow for more tips 👇" /></Field>
          <Field label="Always-include hashtags"><Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="#storypop #ugc" /></Field>
          <label className="flex items-center justify-between gap-3 rounded-2xl border-2 border-input p-3.5 text-sm font-semibold text-foreground">
            Suggest SEO titles and tags
            <input type="checkbox" className="h-5 w-5 accent-primary" checked={seo} onChange={(e) => setSeo(e.target.checked)} />
          </label>
        </div>
        <Button size="lg" fullWidth className="mt-6" onClick={save}>Save and start creating</Button>
      </div>
    </div>
  );
}
