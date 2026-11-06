import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { plans } from "@/lib/catalog";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Storypop AI — Turn One Photo Into Endless AI UGC Videos" },
      {
        name: "description",
        content:
          "Storypop AI turns your photo into a reusable AI character, writes your script, generates, edits and publishes your UGC videos — all in one app.",
      },
      { property: "og:title", content: "Storypop AI — Turn One Photo Into Endless AI UGC Videos" },
      { property: "og:description", content: "Create, edit and publish AI UGC videos from a single photo. No filming, no editing software." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How It Works" },
  { href: "#characters", label: "AI Characters" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

const features = [
  { emoji: "🧬", title: "AI Character Creator", body: "Upload one photo. Get a consistent, reusable animated version of yourself in 3D, Cartoon, Anime, or Stylized Realistic style." },
  { emoji: "🎬", title: "AI UGC Video Generator", body: "Describe your idea in plain language. AI writes the hook, script, and scene breakdown, then generates the full video." },
  { emoji: "✂️", title: "Smart AI Editor", body: "Trim, split, caption, add music — or just say “make this video more energetic” and let AI do it." },
  { emoji: "📤", title: "Social Media Publisher", body: "Auto-generate SEO titles, captions and hashtags, then publish or schedule to all your TikTok, Instagram, YouTube and Facebook accounts." },
  { emoji: "📊", title: "Built-In Analytics", body: "Track views, likes, comments, shares and watch time — and get AI insights on what's actually working." },
  { emoji: "🎯", title: "Targeted Scene Regeneration", body: "Don't like one scene? Regenerate just that scene — not the whole video." },
];

const steps = [
  { title: "Upload your photo", body: "AI turns it into your animated character — ready to reuse in unlimited videos." },
  { title: "Describe your idea", body: "“Create a funny 30-second video promoting my sneaker brand” is enough to get started." },
  { title: "AI writes & builds it", body: "Script, scenes, voice, and video are generated automatically in the background." },
  { title: "Edit with a sentence", body: "Refine tone, pacing, or captions using natural language — no timeline scrubbing required." },
  { title: "Publish everywhere", body: "Post now or schedule across every connected account, with AI-written captions and hashtags." },
];

const styles = [
  { name: "3D", emoji: "🧑🏾‍🎤", body: "Rounded, expressive, and playful — great for lighthearted product promos and comedic hooks." },
  { name: "Cartoon", emoji: "🧑🏾‍🎨", body: "Bold outlines and bright colours that pop in a fast-scrolling feed." },
  { name: "Anime", emoji: "🧑🏾‍💻", body: "Dynamic, stylised and dramatic — perfect for storytelling and reveals." },
  { name: "Stylized Realistic", emoji: "🧑🏾‍💼", body: "Close to real life with a polished finish for trustworthy testimonials." },
];

const faqs = [
  { q: "Do I need filming or editing experience?", a: "No. Storypop AI writes, generates, edits, and publishes for you — the whole pipeline runs inside one app." },
  { q: "How do AI credits work?", a: "Every plan includes a monthly pool of AI credits. Generating one minute of video uses 80 credits, and you can spend them however you like." },
  { q: "Can I use my own voice?", a: "Yes, where voice cloning is enabled, with your explicit authorization and consent." },
  { q: "Can I connect more than one account per platform?", a: "Yes. Link as many TikTok, Instagram, YouTube and Facebook accounts as you need and choose where each video goes." },
  { q: "Can I cancel anytime?", a: "Yes. You can change or cancel your plan at any time from Settings → Plans & Billing." },
];

function Landing() {
  const { isAuthenticated, hydrated } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const authed = hydrated && isAuthenticated;

  return (
    <div className="min-h-dvh bg-primary-deep text-primary-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-primary-foreground/10 bg-primary-deep/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo size={36} className="bg-primary" />
            <span className="font-display text-lg font-extrabold tracking-tight">Storypop AI</span>
          </Link>
          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-semibold text-primary-light/90 hover:text-primary-foreground">
                {l.label}
              </a>
            ))}
          </div>
          <div className="hidden items-center gap-3 md:flex">
            {authed ? (
              <Link to="/home"><Button>Open dashboard</Button></Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-primary-light hover:text-primary-foreground">Log In</Link>
                <Link to="/register"><Button>Get Started</Button></Link>
              </>
            )}
          </div>
          <button className="md:hidden" aria-label="Open menu" onClick={() => setMenuOpen((o) => !o)}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
        {menuOpen && (
          <div className="space-y-1 border-t border-primary-foreground/10 px-5 pb-5 pt-2 md:hidden">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block py-2.5 font-semibold text-primary-light">
                {l.label}
              </a>
            ))}
            <div className="grid grid-cols-2 gap-3 pt-3">
              {authed ? (
                <Link to="/home" className="col-span-2"><Button fullWidth>Open dashboard</Button></Link>
              ) : (
                <>
                  <Link to="/login"><Button variant="outline" fullWidth>Log In</Button></Link>
                  <Link to="/register"><Button fullWidth>Get Started</Button></Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/40 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-16 md:grid-cols-2 md:pt-24">
          <div className="relative">
            <span className="inline-flex rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-3.5 py-1.5 text-xs font-bold text-primary-light">
              Now in Beta — Founding Access Open
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              Turn One Photo Into <span className="text-primary-light">Endless AI UGC Videos</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-primary-light/90">
              Storypop AI turns your photo into a reusable animated character, writes your script, generates your video, edits it, and publishes it — all in one app. No filming. No editing software. No burnout.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={authed ? "/home" : "/register"}>
                <Button size="lg">{authed ? "Open dashboard" : "Create your first video →"}</Button>
              </Link>
              <a href="#how"><Button size="lg" variant="outline" className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">See how it works</Button></a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm rounded-[2rem] border border-primary-foreground/10 bg-primary-foreground/5 p-6 shadow-fab">
            <p className="text-xs font-bold tracking-widest text-primary-light">CREATE · SCENE 3 OF 4</p>
            <p className="mt-2 font-display text-xl font-extrabold">Creating your video…</p>
            <ul className="mt-6 space-y-3.5 text-sm">
              {["Writing script", "Generating scenes", "Animating character", "Adding voice"].map((s, i) => (
                <li key={s} className="flex items-center gap-3">
                  <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold", i < 2 ? "bg-primary text-primary-foreground" : "bg-primary-foreground/10 text-primary-light")}>
                    {i < 2 ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className={i < 2 ? "font-semibold" : "text-primary-light/80"}>{s}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-primary-foreground/10">
              <div className="h-full w-3/5 rounded-full bg-primary" />
            </div>
          </div>
        </div>
        <div className="border-y border-primary-foreground/10 bg-primary-foreground/5">
          <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-10 gap-y-2 px-5 py-4 text-sm font-semibold text-primary-light">
            <span>3 AI engines working together</span>
            <span>9:16 · 16:9 · 1:1 export ready</span>
            <span>TikTok · Instagram · YouTube · Facebook</span>
            <span>One photo → unlimited content</span>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="mx-auto max-w-3xl px-5 py-20 text-center">
        <p className="text-xs font-extrabold uppercase tracking-widest text-primary-light">The problem</p>
        <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight md:text-4xl">Posting consistently shouldn't require a film crew.</h2>
        <p className="mt-4 text-primary-light/90">Filming, scripting, editing, and publishing every single video is exhausting. Storypop AI compresses the entire pipeline into one continuous flow.</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm font-bold">
          {["📸 Your Identity", "🧬 AI Character", "✍️ AI Content", "🎬 Finished UGC", "🚀 Social Publishing"].map((s, i, a) => (
            <span key={s} className="flex items-center gap-3">
              <span className="rounded-full bg-primary-foreground/10 px-4 py-2">{s}</span>
              {i < a.length - 1 && <span className="text-primary-light">→</span>}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 bg-background py-20 text-foreground">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-xs font-extrabold uppercase tracking-widest text-primary">Features</p>
          <h2 className="mt-3 text-center font-display text-3xl font-extrabold tracking-tight md:text-4xl">Everything you need to create, edit, and publish</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">No separate apps, no external editors — the entire workflow lives inside Storypop AI.</p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <article key={f.title} className="rounded-3xl bg-card p-6 shadow-card">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-2xl">{f.emoji}</span>
                <h3 className="mt-4 font-display text-lg font-extrabold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-xs font-extrabold uppercase tracking-widest text-primary-light">How it works</p>
          <h2 className="mt-3 text-center font-display text-3xl font-extrabold tracking-tight md:text-4xl">From photo to published video in 5 steps</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-5">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-3xl border border-primary-foreground/10 bg-primary-foreground/5 p-5">
                <p className="font-display text-3xl font-extrabold text-primary-light">0{i + 1}</p>
                <h3 className="mt-3 font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-primary-light/85">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to={authed ? "/create" : "/register"}><Button size="lg">Try the Full Flow →</Button></Link>
          </div>
        </div>
      </section>

      {/* Characters */}
      <section id="characters" className="scroll-mt-20 bg-background py-20 text-foreground">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-xs font-extrabold uppercase tracking-widest text-primary">AI characters</p>
          <h2 className="mt-3 text-center font-display text-3xl font-extrabold tracking-tight md:text-4xl">Meet your AI self</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">One photo becomes a character you can reuse across unlimited videos — no re-filming, ever.</p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {styles.map((s) => (
              <article key={s.name} className="rounded-3xl bg-card p-6 text-center shadow-card">
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-soft text-4xl">{s.emoji}</span>
                <h3 className="mt-4 font-display text-lg font-extrabold">{s.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-xs font-extrabold uppercase tracking-widest text-primary-light">Pricing</p>
          <h2 className="mt-3 text-center font-display text-3xl font-extrabold tracking-tight md:text-4xl">Simple plans, powered by AI credits</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-primary-light/90">80 credits = 1 minute of video. Cancel anytime.</p>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((p) => (
              <article
                key={p.id}
                className={cn(
                  "relative flex flex-col rounded-3xl p-5",
                  p.recommended ? "bg-primary shadow-fab" : "border border-primary-foreground/10 bg-primary-foreground/5"
                )}
              >
                {p.recommended && (
                  <span className="absolute -top-3 left-5 rounded-full bg-primary-foreground px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-primary">Most Popular</span>
                )}
                <h3 className="font-display text-lg font-extrabold">{p.name}</h3>
                <p className="mt-2 font-display text-3xl font-extrabold">
                  {p.priceMonthly}
                  {!p.custom && <span className="text-sm font-semibold text-primary-light">{p.id === "free" ? " forever" : " / month"}</span>}
                </p>
                <p className="mt-1 text-xs font-bold text-primary-light">{p.minutes}</p>
                <ul className="mt-4 flex-1 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-primary-light">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={3} />
                      {f}
                    </li>
                  ))}
                </ul>
                {p.idealFor && <p className="mt-4 text-xs italic text-primary-light/80">{p.idealFor}</p>}
                <Link to={p.custom ? "/help" : authed ? "/subscription" : "/register"} className="mt-5 block">
                  <Button fullWidth variant={p.recommended ? "outline" : "primary"}>
                    {p.custom ? "Contact sales" : "Get started"}
                  </Button>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-background py-20 text-foreground">
        <div className="mx-auto max-w-3xl px-5">
          <p className="text-center text-xs font-extrabold uppercase tracking-widest text-primary">FAQ</p>
          <h2 className="mt-3 text-center font-display text-3xl font-extrabold tracking-tight md:text-4xl">Questions, answered</h2>
          <div className="mt-10 space-y-3">
            {faqs.map((f, i) => (
              <div key={f.q} className="rounded-2xl bg-card shadow-card">
                <button className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {f.q}
                  <ChevronDown className={cn("h-5 w-5 shrink-0 text-primary transition-transform", openFaq === i && "rotate-180")} />
                </button>
                {openFaq === i && <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + footer */}
      <section className="py-20 text-center">
        <h2 className="mx-auto max-w-2xl px-5 font-display text-3xl font-extrabold tracking-tight md:text-4xl">Your next 100 videos start with one photo.</h2>
        <Link to={authed ? "/home" : "/register"} className="mt-8 inline-block">
          <Button size="lg">{authed ? "Open dashboard" : "Create your free account"}</Button>
        </Link>
      </section>
      <SiteFooter />
    </div>
  );
}
