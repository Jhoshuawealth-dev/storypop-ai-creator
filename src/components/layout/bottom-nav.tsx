import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays, FolderOpen, Home, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/projects", label: "Projects", icon: FolderOpen },
  { to: "/create", label: "Create", icon: Plus, fab: true },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md border-t border-border/70 bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
      aria-label="Main navigation"
    >
      <div className="grid grid-cols-5 items-end px-2 pt-1.5">
        {items.map((item) => {
          const active = pathname === item.to || (item.to !== "/home" && pathname.startsWith(item.to));
          const Icon = item.icon;
          if ("fab" in item && item.fab) {
            return (
              <div key={item.to} className="flex justify-center">
                <Link
                  to={item.to}
                  aria-label="Create UGC"
                  className={cn(
                    "-mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-fab ring-4 ring-card transition-transform hover:scale-105 active:scale-95",
                    active && "bg-primary-deep"
                  )}
                >
                  <Plus className="h-7 w-7" strokeWidth={2.5} />
                </Link>
              </div>
            );
          }
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] font-semibold transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.4 : 1.8} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
