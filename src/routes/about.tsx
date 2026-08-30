import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Logo } from "@/components/logo";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: pageHead("About", "About Storypop AI — the AI UGC creator studio."),
  component: About,
});

const links = ["Terms of Service", "Privacy Policy", "Content Guidelines", "Rate the app", "Licenses"];

function About() {
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
        {links.map((label) => (
          <button
            key={label}
            onClick={() => toast.info(`${label} coming soon`)}
            className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left"
          >
            <span className="min-w-0 flex-1 truncate font-semibold text-foreground">{label}</span>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">© 2026 Storypop AI. Made for creators.</p>
    </AppShell>
  );
}
