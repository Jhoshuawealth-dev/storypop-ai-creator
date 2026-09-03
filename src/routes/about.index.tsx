import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Star } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/about")({
  head: pageHead("About", "About Storypop AI — the AI UGC creator studio."),
  component: About,
});

const links = [
  { label: "Terms of Service", to: "/about/terms" },
  { label: "Privacy Policy", to: "/about/privacy" },
  { label: "Content Guidelines", to: "/about/guidelines" },
  { label: "Licenses", to: "/about/licenses" },
] as const;

function About() {
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);

  return (
    <AppShell title="About" showBack backTo="/profile">
      <div className="mt-8 flex flex-col items-center text-center">
        <Logo className="h-14 w-14" />
        <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-foreground">Storypop AI</h1>
        <p className="text-sm font-semibold text-muted-foreground">Version 1.0.0 (build 128)</p>
        <p className="mt-4 max-w-72 text-[15px] leading-relaxed text-muted-foreground">
          Turn any idea into scroll-stopping UGC video — script, character, voice and publishing, all in one place.
        </p>
      </div>

      <div className="mt-8 divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-card">
        {links.map((link) => (
          <Link key={link.label} to={link.to} className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left">
            <span className="min-w-0 flex-1 truncate font-semibold text-foreground">{link.label}</span>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Link>
        ))}
        <button
          onClick={() => setShowRating(true)}
          className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left"
        >
          <span className="min-w-0 flex-1 truncate font-semibold text-foreground">Rate the app</span>
          <Star className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">© 2026 Storypop AI. Made for creators.</p>

      {showRating && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 px-5 pb-10 backdrop-blur-sm"
          onClick={() => setShowRating(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-card p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-xl font-bold text-foreground">Enjoying Storypop?</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">Tap a star to rate your experience.</p>
            <div className="mt-5 flex justify-center gap-2.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setRating(n)} aria-label={`Rate ${n} stars`}>
                  <Star
                    className={cn(
                      "h-9 w-9 transition-colors",
                      n <= rating ? "fill-primary text-primary" : "text-border"
                    )}
                  />
                </button>
              ))}
            </div>
            <Button
              size="lg"
              fullWidth
              className="mt-6"
              disabled={rating === 0}
              onClick={() => {
                setShowRating(false);
                toast.success("Thanks for rating Storypop AI!");
                setRating(0);
              }}
            >
              Submit rating
            </Button>
            <Button variant="ghost" size="md" fullWidth className="mt-1" onClick={() => setShowRating(false)}>
              Not now
            </Button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
