import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Laptop, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/settings/security/devices")({
  head: pageHead("Active Devices", "See and manage devices signed in to Storypop AI."),
  component: Devices,
});

function describeDevice(ua: string) {
  const mobile = /Mobi|Android|iPhone|iPad/i.test(ua);
  const os = /iPhone|iPad/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Mac OS X/.test(ua) ? "macOS" : /Windows/.test(ua) ? "Windows" : /Linux/.test(ua) ? "Linux" : "Unknown system";
  const browser = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Browser";
  return { mobile, label: `${browser} on ${os}` };
}

function Devices() {
  const [device, setDevice] = useState<{ mobile: boolean; label: string } | null>(null);
  const [lastSignIn, setLastSignIn] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDevice(describeDevice(navigator.userAgent));
    void supabase.auth.getUser().then(({ data }) => {
      const at = data.user?.last_sign_in_at;
      if (at) setLastSignIn(new Date(at).toLocaleString());
    });
  }, []);

  const signOutOthers = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signOut({ scope: "others" });
    setBusy(false);
    if (error) return void toast.error(error.message);
    toast.success("Signed out of all other devices");
  };

  const Icon = device?.mobile ? Smartphone : Laptop;

  return (
    <AppShell title="Active Devices" showBack backTo="/settings/security">
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        If you don't recognise activity on your account, sign out everywhere else and change your password.
      </p>

      <SectionHeader title="This device" />
      {device && (
        <div className="flex items-center gap-3.5 rounded-2xl bg-card p-4 shadow-card">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary">
            <Icon className="h-5 w-5 text-primary-foreground" strokeWidth={1.8} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-foreground">
              {device.label}
              <span className="ml-2 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-primary">Active now</span>
            </p>
            {lastSignIn && <p className="truncate text-xs text-muted-foreground">Last sign-in: {lastSignIn}</p>}
          </div>
        </div>
      )}

      <SectionHeader title="Other devices" />
      <p className="text-sm leading-relaxed text-muted-foreground">
        Any phone, tablet or computer you've signed in on stays signed in until you sign out. Use the button below to sign them all out at once — this device stays signed in.
      </p>
      <Button variant="outline" size="lg" fullWidth className="mt-5" loading={busy} onClick={() => void signOutOthers()}>
        Sign out all other devices
      </Button>
    </AppShell>
  );
}
