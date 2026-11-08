import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { SiteFooter } from "@/components/layout/site-footer";

/** Public website layout for legal pages — no login, no dashboard. */
export function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
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
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">{title}</h1>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
