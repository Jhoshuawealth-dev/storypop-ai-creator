import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronDown, LifeBuoy, Search } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { faqs } from "@/lib/catalog";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/support")({
  head: pageHead("Support", "Answers to common questions and a direct line to the Storypop AI team."),
  component: SupportPage,
});

function SupportPage() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<number | null>(0);

  const results = faqs.filter(
    (f) => f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between px-5 py-4 md:px-8">
        <Link to="/" aria-label="Storypop AI home">
          <LogoMark />
        </Link>
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-20 md:px-8">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10">
            <LifeBuoy className="h-7 w-7 text-primary" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">Support</h1>
            <p className="mt-1 text-sm text-muted-foreground">Quick answers, and a direct line to the team when you need more.</p>
          </div>
        </div>

        <div className="relative mt-8">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search help topics…"
            aria-label="Search help topics"
            className="rounded-2xl bg-card pl-11"
          />
        </div>

        <div className="mt-6 space-y-3">
          {results.length === 0 ? (
            <div className="rounded-3xl bg-card p-8 text-center shadow-card">
              <p className="text-sm font-semibold text-foreground">No matching topics</p>
              <p className="mt-1 text-sm text-muted-foreground">Try a different search, or send us your question directly.</p>
              <Link to="/contact" className="mt-4 inline-block">
                <Button variant="outline">Contact us</Button>
              </Link>
            </div>
          ) : (
            results.map((f, i) => (
              <div key={f.q} className="rounded-3xl bg-card shadow-card">
                <button
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold text-foreground"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  {f.q}
                  <ChevronDown className={cn("h-5 w-5 shrink-0 text-primary transition-transform", open === i && "rotate-180")} />
                </button>
                {open === i && <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>}
              </div>
            ))
          )}
        </div>

        <div className="mt-10 rounded-3xl bg-primary p-8 text-center text-white shadow-card">
          <h2 className="font-display text-xl font-bold">Still need help?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/80">
            Send the team a message through our contact form. It goes straight to us and we reply by email.
          </p>
          <Link to="/contact" className="mt-5 inline-block">
            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              Open the contact form
            </Button>
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
