import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TopBar } from "./top-bar";
import { BottomNav } from "./bottom-nav";

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
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background shadow-2xl shadow-primary/10">
      {title ? <TopBar title={title} subtitle={subtitle} showBack={showBack} backTo={backTo} right={right} /> : null}
      <main className={cn("flex-1 animate-screen-in", padded && "px-5", !hideNav && "pb-28", className)}>{children}</main>
      {!hideNav && <BottomNav />}
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
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background shadow-2xl shadow-primary/10">
      {title ? <TopBar title={title} showBack={showBack} backTo={backTo} right={right} /> : null}
      <main className={cn("flex-1 animate-screen-in px-5 pb-10", className)}>{children}</main>
    </div>
  );
}
