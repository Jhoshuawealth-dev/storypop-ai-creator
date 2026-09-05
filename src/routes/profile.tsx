import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  ChevronRight,
  CreditCard,
  HelpCircle,
  Info,
  LogOut,
  Settings,
  Share2,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-ring";
import { SectionHeader } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { formatDate, formatDuration } from "@/lib/catalog";
import { Avatar } from "@/components/ui/avatar";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: pageHead("Profile", "Your Storypop AI account, plan and settings."),
  component: Profile,
});

const groups = [
  {
    title: "Creating",
    items: [
      { label: "My Characters", to: "/characters", icon: Users },
      { label: "Analytics", to: "/analytics", icon: BarChart3 },
      { label: "Subscription", to: "/subscription/manage", icon: CreditCard },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Account Settings", to: "/settings", icon: Settings },
      { label: "Social Accounts", to: "/settings/social", icon: Share2 },
      { label: "Notifications", to: "/settings/notifications", icon: Bell },
      { label: "Security & Privacy", to: "/settings/security", icon: Shield },
    ],
  },
  {
    title: "More",
    items: [
      { label: "Help & Support", to: "/help", icon: HelpCircle },
      { label: "About Storypop AI", to: "/about", icon: Info },
    ],
  },
] as const;

function Profile() {
  const navigate = useNavigate();
  const { signOut, user, projects, subscription, minutesTotal, minutesUsed, planName } = useApp();
  const remaining = Math.max(0, minutesTotal - minutesUsed);
  const published = projects.filter((p) => p.status === "published").length;

  return (
    <AppShell title="Profile">
      <section className="mt-5 flex items-center gap-4">
        <Avatar
          src={user.avatar || undefined}
          name={user.fullName || user.name}
          className="h-18 w-18 shrink-0 rounded-3xl text-xl shadow-card"
        />
        <div className="min-w-0">
          <h1 className="truncate font-display text-xl font-extrabold text-foreground">{user.fullName || "Your profile"}</h1>
          <p className="truncate text-sm text-muted-foreground">{user.email || "Add your email in settings"}</p>
          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-extrabold text-primary">
            <Sparkles className="h-3 w-3" /> {planName} Plan
          </span>
        </div>
      </section>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          ["Videos", String(projects.length)],
          ["Published", String(published)],
          ["Minutes left", formatDuration(remaining)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-card p-3.5 text-center shadow-card">
            <p className="font-display text-lg font-extrabold text-foreground">{value}</p>
            <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <section className="mt-4 rounded-3xl bg-primary-deep p-5 text-primary-foreground shadow-fab">
        <div className="flex items-center justify-between">
          <p className="font-bold">{planName} plan</p>
          <Link to="/subscription" className="text-xs font-extrabold text-primary-light underline">
            Upgrade
          </Link>
        </div>
        <ProgressBar value={minutesTotal ? remaining / minutesTotal : 0} className="mt-3 bg-white/15" />
        <p className="mt-2 text-xs text-primary-light">
          {formatDuration(remaining)} of {formatDuration(minutesTotal)} left · renews {formatDate(subscription.renewsOn)}
        </p>
      </section>

      {groups.map((group) => (
        <div key={group.title}>
          <SectionHeader title={group.title} />
          <div className="divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-card">
            {group.items.map((item) => (
              <Link key={item.label} to={item.to} className="flex items-center gap-3.5 px-4 py-3.5">
                <item.icon className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.8} />
                <span className="min-w-0 flex-1 truncate font-semibold text-foreground">{item.label}</span>
                <ChevronRight className="h-4.5 w-4.5 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      ))}

      <Button
        variant="danger"
        size="lg"
        fullWidth
        className="mt-6"
        onClick={() => {
          signOut();
          toast.success("Signed out");
          navigate({ to: "/login" });
        }}
      >
        <LogOut className="h-4 w-4" /> Log out
      </Button>
    </AppShell>
  );
}
