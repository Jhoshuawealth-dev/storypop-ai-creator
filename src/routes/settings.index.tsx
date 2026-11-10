import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Bell, Bot, ChevronRight, CreditCard, Gauge, Info, LifeBuoy, LogOut, Mic, Palette, Plug,
  Send, Share2, Shield, SlidersHorizontal, Sparkles, User, Users, type LucideIcon,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Avatar } from "@/components/ui/avatar";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/settings/")({
  head: pageHead("Settings", "Manage your Storypop AI account, brand, publishing and billing."),
  component: SettingsHub,
});

type Item = { to: string; label: string; desc: string; icon: LucideIcon };

const groups: { title: string; items: Item[] }[] = [
  {
    title: "Account",
    items: [
      { to: "/settings/profile", label: "Profile", desc: "Name, photo, email and bio", icon: User },
      { to: "/settings/security", label: "Security", desc: "Password, 2FA, devices, your data", icon: Shield },
      { to: "/settings/notifications", label: "Notifications", desc: "What we tell you about", icon: Bell },
    ],
  },
  {
    title: "Creating",
    items: [
      { to: "/settings/brand", label: "Brand Kit", desc: "Niche, audience and tone", icon: Palette },
      { to: "/settings/ai", label: "AI Preferences", desc: "Language, length, format, hooks", icon: Sparkles },
      { to: "/settings/voices", label: "Characters & Voices", desc: "Default voice and character", icon: Mic },
    ],
  },
  {
    title: "Publishing",
    items: [
      { to: "/settings/social", label: "Social Accounts", desc: "Link several accounts per platform", icon: Share2 },
      { to: "/settings/publishing", label: "Publishing Defaults", desc: "Captions, hashtags, posting times", icon: Send },
      { to: "/settings/autopilot", label: "Autopilot", desc: "Automatic planning and drafts", icon: Bot },
    ],
  },
  {
    title: "Business",
    items: [
      { to: "/settings/team", label: "Team", desc: "Invite teammates", icon: Users },
      { to: "/settings/apps", label: "Connected Apps", desc: "Drive, Canva, Shopify and more", icon: Plug },
    ],
  },
  {
    title: "Billing",
    items: [
      { to: "/subscription", label: "Plans & Billing", desc: "Change or manage your plan", icon: CreditCard },
      { to: "/usage", label: "Usage & Credits", desc: "AI credits used this month", icon: Gauge },
    ],
  },
  {
    title: "More",
    items: [
      { to: "/settings/preferences", label: "App Preferences", desc: "Language, appearance, currency", icon: SlidersHorizontal },
      { to: "/help", label: "Help & Support", desc: "FAQs and contact", icon: LifeBuoy },
      { to: "/about", label: "About", desc: "Terms, privacy, licences", icon: Info },
    ],
  },
];

function SettingsHub() {
  const { user, planName, signOut } = useApp();
  const navigate = useNavigate();

  return (
    <AppShell title="Settings" showBack backTo="/profile">
      <div className="mx-auto w-full max-w-3xl pb-10 pt-5">
        <Link to="/settings/profile" className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-card">
          <Avatar src={user.avatar} name={user.fullName} className="h-14 w-14 rounded-2xl text-lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-foreground">{user.fullName || "Your profile"}</p>
            <p className="truncate text-sm text-muted-foreground">{user.email || "Add your email"}</p>
          </div>
          <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-extrabold text-primary">{planName}</span>
        </Link>

        <div className="mt-2 grid gap-x-6 md:grid-cols-2">
          {groups.map((g) => (
            <section key={g.title}>
              <h2 className="mb-2 mt-6 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">{g.title}</h2>
              <div className="divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-card">
                {g.items.map((it) => (
                  <Link key={it.to} to={it.to} className="flex items-center gap-3.5 p-4 transition-colors hover:bg-muted/50">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <it.icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-foreground">{it.label}</span>
                      <span className="block truncate text-xs text-muted-foreground">{it.desc}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <button
          onClick={() => {
            signOut();
            navigate({ to: "/login" });
          }}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-card p-4 font-bold text-destructive shadow-card"
        >
          <LogOut className="h-5 w-5" /> Log out
        </button>
      </div>
    </AppShell>
  );
}
