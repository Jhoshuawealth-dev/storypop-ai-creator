import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TopBar } from "./top-bar";
import { WorkspaceNav } from "./workspace-nav";
import { Button } from "@/components/ui/button";

export function AppShell({
  children,
  title,
  subtitle,
  showBack,
  backTo,
  right,
  hideNav = false,
  padded = true,
  className,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  backTo?: string;
  right?: ReactNode;
  hideNav?: boolean;
  padded?: boolean;
  className?: string;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <div className="min-h-dvh w-full bg-background">
      {!hideNav && <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border lg:block"><WorkspaceNav /></aside>}
      <div className={cn("min-h-dvh", !hideNav && "lg:pl-64")}>
        <TopBar
          title={title ?? "Storypop AI"}
          subtitle={subtitle}
          showBack={showBack}
          backTo={backTo}
          right={right}
          onMenuClick={!hideNav ? () => setDrawerOpen((open) => !open) : undefined}
          menuOpen={drawerOpen}
        />
        <main className={cn("mx-auto min-h-[calc(100dvh-4rem)] w-full max-w-7xl animate-screen-in", padded && "px-5 sm:px-8", !hideNav && "pb-8", className)}>{children}</main>
      </div>
      {!hideNav && drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close navigation" className="absolute inset-0 bg-foreground/30" onClick={() => setDrawerOpen(false)} />
          <aside className="relative h-full w-[min(20rem,85vw)] border-r border-border bg-background shadow-card">
            <div className="absolute right-2 top-2 z-10">
              <Button variant="ghost" size="icon" aria-label="Close navigation" onClick={() => setDrawerOpen(false)}><X className="h-5 w-5" /></Button>
            </div>
            <WorkspaceNav onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}
    </div>
  );
}

/** Bare mobile frame without bottom nav — for auth and flow screens. */
export function FlowShell({
  children,
  title,
  showBack = true,
  backTo,
  right,
  className,
}: {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  backTo?: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col bg-background">
      {title ? <TopBar title={title} showBack={showBack} backTo={backTo} right={right} /> : null}
      <main className={cn("flex-1 animate-screen-in px-5 pb-10", className)}>{children}</main>
    </div>
  );
}
