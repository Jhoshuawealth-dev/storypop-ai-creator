import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bot,
  CalendarDays,
  Clapperboard,
  FlaskConical,
  FolderOpen,
  Gauge,
  Lightbulb,
  Megaphone,
  Settings2,
  Shield,
  Sparkles,
  UserRound,
  Users,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";
import { LogoMark } from "@/components/logo";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  minimum?: "pro" | "business";
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const mainItems: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: Gauge },
];

const groups: NavGroup[] = [
  {
    label: "Create",
    items: [
      { label: "Create Video", to: "/create", icon: WandSparkles },
      { label: "Characters", to: "/characters", icon: UserRound },
      { label: "Storypop Clips", to: "/create/clips", icon: Clapperboard },
      { label: "Reverse Engineer", to: "/create/reverse-engineer", icon: Sparkles, minimum: "pro" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Storypop Brain", to: "/intelligence/brain", icon: Bot },
      { label: "Content DNA", to: "/intelligence/content-dna", icon: Sparkles, minimum: "pro" },
      { label: "Trends", to: "/intelligence/trends", icon: Lightbulb },
      { label: "Competitor Radar", to: "/intelligence/competitors", icon: Users, minimum: "pro" },
    ],
  },
  {
    label: "Growth",
    items: [
      { label: "Experiments", to: "/growth/experiments", icon: FlaskConical, minimum: "pro" },
      { label: "Autopilot", to: "/growth/autopilot", icon: Bot, minimum: "pro" },
      { label: "Community Agent", to: "/growth/community", icon: Users, minimum: "business" },
      { label: "Revenue Intelligence", to: "/growth/revenue", icon: BarChart3, minimum: "business" },
    ],
  },
];

const businessItems: NavItem[] = [
  { label: "Affiliate Marketing", to: "/monetization/affiliates", icon: Megaphone, minimum: "business" },
  { label: "Affiliate Autopilot", to: "/monetization/autopilot", icon: Bot, minimum: "business" },
];

const footerItems: NavItem[] = [
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
  { label: "Calendar", to: "/calendar", icon: CalendarDays },
  { label: "Projects", to: "/projects", icon: FolderOpen },
  { label: "Settings", to: "/settings", icon: Settings2 },
  { label: "Security & Privacy", to: "/settings/security", icon: Shield },
];

const levels: Record<string, number> = { free: 0, creator: 1, pro: 2, business: 3 };

export function WorkspaceNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { planName, user } = useApp();
  const planLevel = levels[planName.toLowerCase()] ?? 0;
  const visibleBusinessItems = planLevel >= levels["business"] ? businessItems : [];

  const itemLink = (item: NavItem) => {
    const requiredLevel = item.minimum ? levels[item.minimum] ?? 0 : 0;
    const locked = item.minimum ? planLevel < requiredLevel : false;
    const Icon = item.icon;
    const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
    return (
      <Link
        key={item.to}
        to={item.to}
        onClick={onNavigate}
        className={cn(
          "flex min-h-10 items-center gap-2.5 rounded-md px-3 text-sm font-semibold transition-colors",
          active ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" strokeWidth={1.9} />
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
        {locked && <span className="text-[10px] font-bold uppercase tracking-wide">{item.minimum}</span>}
      </Link>
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="border-b border-border px-5 py-5">
        <LogoMark />
      </div>
      <nav aria-label="Workspace" className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 py-5">
        <div className="space-y-1">{mainItems.map(itemLink)}</div>
        {groups.map((group) => (
          <section key={group.label}>
            <h2 className="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">{group.label}</h2>
            <div className="space-y-0.5">{group.items.map(itemLink)}</div>
          </section>
        ))}
        {visibleBusinessItems.length > 0 && (
          <section>
            <h2 className="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Monetization</h2>
            <div className="space-y-0.5">{visibleBusinessItems.map(itemLink)}</div>
          </section>
        )}
        <div className="space-y-0.5 border-t border-border pt-4">{footerItems.map(itemLink)}</div>
      </nav>
      <div className="border-t border-border px-4 py-4">
        <Link to="/profile" onClick={onNavigate} className="flex min-w-0 items-center gap-3 rounded-md px-2 py-2 hover:bg-muted">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-extrabold text-primary">
            {(user.name || user.fullName || "U").slice(0, 1).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold text-foreground">{user.name || "Your account"}</span>
            <span className="block truncate text-xs text-muted-foreground">{planName} Plan</span>
          </span>
        </Link>
      </div>
    </div>
  );
}