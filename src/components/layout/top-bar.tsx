import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Menu, X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function TopBar({
  title,
  subtitle,
  showBack = false,
  backTo,
  right,
  onMenuClick,
  menuOpen = false,
}: {
  title: string;
  subtitle?: string | undefined;
  showBack?: boolean | undefined;
  backTo?: string | undefined;
  right?: ReactNode | undefined;
  onMenuClick?: (() => void) | undefined;
  menuOpen?: boolean | undefined;
}) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border/60 bg-background/90 px-3 backdrop-blur-md sm:px-6">
      {onMenuClick && (
        <div className="lg:hidden">
          <Button variant="ghost" size="icon" onClick={onMenuClick} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      )}
      {showBack ? (
        <button
          onClick={() => (backTo ? navigate({ to: backTo }) : window.history.back())}
          aria-label="Go back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-primary-soft"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      ) : !onMenuClick ? (
        <span className="w-10 shrink-0" />
      ) : null}
      <div className="min-w-0 flex-1 text-center">
        <h1 className="truncate text-base font-bold text-foreground">{title}</h1>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex w-10 shrink-0 items-center justify-end">{right}</div>
    </header>
  );
}
