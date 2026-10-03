import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, LockKeyhole, Plus, Sparkles, Upload } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, TextArea } from "@/components/ui/input";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

type PlanLevel = "creator" | "pro" | "business";

interface FeatureDefinition {
  title: string;
  subtitle: string;
  eyebrow: string;
  minimumPlan?: PlanLevel;
  highlights: { label: string; value: string; detail: string }[];
  action: string;
}

const definitions: Record<string, FeatureDefinition> = {
  clips: {
    title: "Storypop Clips",
    subtitle: "Turn one long video into a set of short-form moments.",
    eyebrow: "CREATE",
    highlights: [
      { label: "Source video", value: "Add a recording", detail: "Choose a video file to begin a clip review." },
      { label: "Detected moments", value: "Review highlights", detail: "Pick strong moments before shaping each clip." },
      { label: "Clip output", value: "Hook · captions · duration", detail: "Prepare platform-ready edits for export or publishing." },
    ],
    action: "Analyze video",
  },
  "reverse-engineer": {
    title: "Viral Reverse Engineering",
    subtitle: "Learn from a format, then make a genuinely original version for your audience.",
    eyebrow: "CREATE",
    minimumPlan: "pro",
    highlights: [
      { label: "Hook", value: "Opening promise", detail: "Identify the opening device and viewer expectation." },
      { label: "Structure", value: "Story beats", detail: "Map setup, pacing, payoff, and call to action." },
      { label: "Original response", value: "Your own angle", detail: "Generate a fresh concept; never reproduce another creator’s work." },
    ],
    action: "Analyze format",
  },
  brain: {
    title: "Storypop Brain",
    subtitle: "A working profile of the voice, audience, and creative choices you want Storypop to use.",
    eyebrow: "INTELLIGENCE",
    minimumPlan: "creator",
    highlights: [
      { label: "Niche", value: "Set your focus", detail: "Describe the subjects you create about." },
      { label: "Audience", value: "Define who you reach", detail: "Add the people your videos are made for." },
      { label: "Voice & style", value: "Make it sound like you", detail: "Capture tone, formats, favorite themes, and preferences." },
    ],
    action: "Save Brain profile",
  },
  "content-dna": {
    title: "Content DNA",
    subtitle: "See the creative patterns worth testing across your videos.",
    eyebrow: "INTELLIGENCE",
    minimumPlan: "pro",
    highlights: [
      { label: "Topics", value: "What you talk about", detail: "Compare recurring topics and audience response." },
      { label: "Hooks & CTAs", value: "How you begin and close", detail: "Review opening and closing patterns." },
      { label: "Format & length", value: "The shape of your videos", detail: "Explore formats, characters, styles, and posting times." },
    ],
    action: "Review content patterns",
  },
  trends: {
    title: "Trend-to-You",
    subtitle: "Assess emerging formats and adapt them to your niche.",
    eyebrow: "INTELLIGENCE",
    minimumPlan: "creator",
    highlights: [
      { label: "Trend review", value: "Relevance first", detail: "Compare platform, momentum, and fit for your audience." },
      { label: "Why it matters", value: "A useful reason to act", detail: "Understand the creative opening, not just the trend name." },
      { label: "Adaptation", value: "Make it yours", detail: "Draft a fresh angle instead of copying a trending post." },
    ],
    action: "Adapt a trend",
  },
  competitors: {
    title: "Competitor Radar",
    subtitle: "Compare public creative patterns and find a gap for your next original video.",
    eyebrow: "INTELLIGENCE",
    minimumPlan: "pro",
    highlights: [
      { label: "Profiles", value: "Add a public profile", detail: "Keep a local list of accounts you want to learn from." },
      { label: "Patterns", value: "Topics · format · cadence", detail: "Organize observations and recurring content themes." },
      { label: "Content gaps", value: "Find another point of view", detail: "Explore questions and angles not covered in your niche." },
    ],
    action: "Add profile",
  },
  experiments: {
    title: "Experiment Engine",
    subtitle: "Set up intentional tests for hooks, formats, topics, CTAs, and publishing times.",
    eyebrow: "GROWTH",
    minimumPlan: "pro",
    highlights: [
      { label: "Hypothesis", value: "What will you learn?", detail: "Choose one creative variable at a time." },
      { label: "Variants", value: "A · B · C", detail: "Write alternatives to compare in your next posts." },
      { label: "Status", value: "Ready to test", detail: "Results stay blank until you add real performance data." },
    ],
    action: "Create experiment",
  },
  autopilot: {
    title: "Autopilot",
    subtitle: "Shape a content routine that plans, drafts, schedules, and reviews with you in control.",
    eyebrow: "GROWTH",
    minimumPlan: "pro",
    highlights: [
      { label: "Planning", value: "Choose your cadence", detail: "Set the weekly pace and preferred channels." },
      { label: "Approval", value: "Keep control", detail: "Choose whether each item needs your approval." },
      { label: "Learning", value: "Improve over time", detail: "Use verified performance when it becomes available." },
    ],
    action: "Save strategy",
  },
  community: {
    title: "Community Agent",
    subtitle: "Turn recurring questions, feedback, and objections into useful content ideas.",
    eyebrow: "GROWTH",
    minimumPlan: "business",
    highlights: [
      { label: "Audience signals", value: "Questions · comments", detail: "Organize feedback themes you choose to add." },
      { label: "Content ideas", value: "Answer what people ask", detail: "Turn a frequent question into an idea or script outline." },
      { label: "Replies & FAQs", value: "Useful responses", detail: "Prepare a reply or FAQ for your review." },
    ],
    action: "Add an audience question",
  },
  revenue: {
    title: "Revenue Intelligence",
    subtitle: "Bring content and commercial outcomes into one performance view.",
    eyebrow: "GROWTH",
    minimumPlan: "business",
    highlights: [
      { label: "Views", value: "Awaiting data", detail: "Connect a source before interpreting performance." },
      { label: "Clicks · leads · conversions", value: "Awaiting data", detail: "No account metrics are fabricated or prefilled." },
      { label: "Revenue", value: "Awaiting data", detail: "Track verified revenue by video, platform, and topic." },
    ],
    action: "Add a revenue note",
  },
  affiliates: {
    title: "Affiliate Marketing",
    subtitle: "Organize products, content angles, links, and attribution in one workspace.",
    eyebrow: "MONETIZATION",
    minimumPlan: "business",
    highlights: [
      { label: "Product", value: "Describe the offer", detail: "Record the product URL and its approved affiliate link." },
      { label: "Creative", value: "Angle · script · CTA", detail: "Prepare an original product story for review." },
      { label: "Results", value: "Clicks · commission", detail: "Add real outcomes when they are available." },
    ],
    action: "Add affiliate product",
  },
  "affiliate-autopilot": {
    title: "Affiliate Autopilot",
    subtitle: "Plan a reviewable pipeline from product ideas to measurable affiliate content.",
    eyebrow: "MONETIZATION",
    minimumPlan: "business",
    highlights: [
      { label: "Product queue", value: "Choose products", detail: "Prioritize items you are authorized to promote." },
      { label: "Content pipeline", value: "Draft · review · schedule", detail: "Approve each angle, script, and post before use." },
      { label: "Winning products", value: "Learn from outcomes", detail: "Use actual click, conversion, and commission data." },
    ],
    action: "Add product to queue",
  },
};

const numericPlan: Record<string, number> = { free: 0, creator: 1, pro: 2, business: 3 };

export function WorkspaceFeature({ featureKey }: { featureKey: string }) {
  const definition = definitions[featureKey];
  const { planName } = useApp();
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [source, setSource] = useState("");
  const planKey = planName.toLowerCase();
  const locked = Boolean(definition?.minimumPlan && (numericPlan[planKey] ?? 0) < numericPlan[definition.minimumPlan]);

  if (!definition) return null;

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
  };

  return (
    <AppShell title={definition.title}>
      <div className="mx-auto w-full max-w-5xl pb-8 pt-7">
        <p className="text-xs font-extrabold uppercase tracking-widest text-primary">{definition.eyebrow}</p>
        <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-extrabold text-foreground">{definition.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{definition.subtitle}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Workspace
          </span>
        </div>

        {locked ? (
          <section className="mt-6 flex items-start gap-4 rounded-xl border border-primary-light bg-card p-5 shadow-card">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
              <LockKeyhole className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-foreground">Available on {definition.minimumPlan === "business" ? "Business" : "Pro"}</h2>
              <p className="mt-1 text-sm text-muted-foreground">Upgrade your plan to use this workspace.</p>
              <Link to="/subscription" className="mt-4 inline-flex">
                <Button>Upgrade to {definition.minimumPlan === "business" ? "Business" : "Pro"}</Button>
              </Link>
            </div>
          </section>
        ) : (
          <>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {definition.highlights.map((item) => (
                <article key={item.label} className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
                  <p className="mt-2 font-display text-lg font-extrabold text-foreground">{item.value}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                </article>
              ))}
            </div>

            <section className="mt-6 grid gap-6 border-y border-border py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">{featureKey === "autopilot" ? "Strategy controls" : "Workspace"}</h2>
                <p className="mt-1 text-sm text-muted-foreground">Changes are local to this preview; no external account or service is connected.</p>
                {featureKey === "autopilot" && (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={enabled}
                    onClick={() => setEnabled((current) => !current)}
                    className={cn("mt-5 inline-flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-bold", enabled ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-foreground")}
                  >
                    <span className={cn("h-2.5 w-2.5 rounded-full", enabled ? "bg-primary" : "bg-muted-foreground")} />
                    Autopilot {enabled ? "enabled" : "paused"}
                  </button>
                )}
                {featureKey === "clips" && (
                  <label className="mt-5 flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary-light bg-primary-soft/50 p-5 text-center">
                    <Upload className="h-5 w-5 text-primary" />
                    <span className="text-sm font-bold text-foreground">{source || "Choose a source video"}</span>
                    <span className="text-xs text-muted-foreground">Video selection is a local interface preview</span>
                    <input className="sr-only" type="file" accept="video/*" onChange={(event) => setSource(event.target.files?.[0]?.name ?? "")} />
                  </label>
                )}
                {featureKey === "reverse-engineer" && (
                  <Field label="Video URL or transcript" className="mt-5">
                    <TextArea rows={5} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Paste a public URL or a transcript you have permission to analyze." />
                  </Field>
                )}
              </div>
              <form onSubmit={save} className="space-y-4">
                {featureKey === "affiliates" && <Field label="Product name"><Input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Enter a product you are authorized to promote" /></Field>}
                {featureKey !== "clips" && featureKey !== "reverse-engineer" && featureKey !== "affiliates" && (
                  <Field label={featureKey === "brain" ? "Niche, audience, or brand voice" : featureKey === "competitors" ? "Public profile or observation" : featureKey === "community" ? "Audience question or feedback" : featureKey === "revenue" ? "Revenue note" : featureKey === "experiments" ? "Hypothesis to test" : "Notes"}>
                    <TextArea rows={5} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Add your own notes or preferences..." />
                  </Field>
                )}
                <Button type="submit" size="lg" fullWidth>
                  {saved ? <><Check className="h-4 w-4" /> Saved locally</> : <><Plus className="h-4 w-4" /> {definition.action}</>}
                </Button>
                {saved && <p role="status" className="text-sm text-muted-foreground">Saved in this screen’s temporary state.</p>}
              </form>
            </section>

            {(featureKey === "competitors" || featureKey === "experiments" || featureKey === "affiliates" || featureKey === "affiliate-autopilot") && (
              <p className="mt-5 text-xs text-muted-foreground">No example accounts, products, or performance results are attached to your workspace.</p>
            )}
          </>
        )}

        <Link to="/create/" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary">
          Continue to Create Video <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </AppShell>
  );
}