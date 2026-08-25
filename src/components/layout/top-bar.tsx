import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function TopBar({
  title,
  subtitle,
  showBack = false,
  backTo,
  right,
}: {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backTo?: string;
  right?: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border/60 bg-background/85 px-3 backdrop-blur-md">
      {showBack ? (
        <button
          onClick={() => (backTo ? navigate({ to: backTo }) : window.history.back())}
          aria-label="Go back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-primary-soft"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      ) : (
        <span className="w-10 shrink-0" />
      )}
      <div className="min-w-0 flex-1 text-center">
        <h1 className="truncate text-base font-bold text-foreground">{title}</h1>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex w-10 shrink-0 items-center justify-end">{right}</div>
    </header>
  );
}
