import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Copy, KeyRound, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/input";
import { OtpInput } from "@/components/ui/otp-input";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/settings/security/2fa")({
  head: pageHead("Two-Factor Authentication", "Secure your Storypop AI account with two-factor authentication."),
  component: TwoFactor,
});

function TwoFactor() {
  const [verifiedId, setVerifiedId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [enroll, setEnroll] = useState<{ id: string; qr: string; secret: string } | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    const { data } = await supabase.auth.mfa.listFactors();
    const verified = data?.totp.find((f) => f.status === "verified");
    setVerifiedId(verified?.id ?? null);
    setLoaded(true);
    return data;
  };

  useEffect(() => {
    void refresh();
  }, []);

  const start = async () => {
    setBusy(true);
    // Clear any half-finished setup first.
    const data = await refresh();
    for (const f of data?.all ?? []) if (f.status === "unverified") await supabase.auth.mfa.unenroll({ factorId: f.id });
    const { data: res, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: `Storypop ${Date.now()}` });
    setBusy(false);
    if (error || !res) return void toast.error(error?.message ?? "Couldn't start setup.");
    setEnroll({ id: res.id, qr: res.totp.qr_code, secret: res.totp.secret });
  };

  const verify = async () => {
    if (!enroll || code.length < 6) return;
    setBusy(true);
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: enroll.id, code });
    setBusy(false);
    if (error) return void toast.error("That code didn't match. Try the latest code from your app.");
    setEnroll(null);
    setCode("");
    await refresh();
    toast.success("Two-factor authentication is on");
  };

  const turnOff = async () => {
    if (!verifiedId) return;
    setBusy(true);
    const { error } = await supabase.auth.mfa.unenroll({ factorId: verifiedId });
    setBusy(false);
    if (error) return void toast.error(error.message.includes("aal2") ? "Sign out and sign in again with your code, then turn it off." : error.message);
    await refresh();
    toast.success("Two-factor authentication turned off");
  };

  const enabled = Boolean(verifiedId);

  return (
    <AppShell title="Two-Factor Authentication" showBack backTo="/settings/security">
      <div className="mt-8 flex flex-col items-center text-center">
        <div className={cn("flex h-20 w-20 items-center justify-center rounded-3xl", enabled ? "bg-primary" : "bg-primary-soft")}>
          <ShieldCheck className={cn("h-9 w-9", enabled ? "text-primary-foreground" : "text-primary")} strokeWidth={1.6} />
        </div>
        <h2 className="mt-4 font-display text-xl font-bold text-foreground">
          {enabled ? "2FA is on" : enroll ? "Set up 2FA" : "Protect your account"}
        </h2>
        <p className="mt-1.5 max-w-72 text-sm leading-relaxed text-muted-foreground">
          {enabled
            ? "Your account is protected by an authenticator app."
            : "Add an extra layer of security with an authenticator app like Google Authenticator or Authy."}
        </p>
      </div>

      {loaded && !enabled && !enroll && (
        <Button size="lg" fullWidth className="mt-8" loading={busy} onClick={() => void start()}>
          <KeyRound className="h-4 w-4" /> Set up two-factor auth
        </Button>
      )}

      {enroll && (
        <div className="mt-8">
          <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-3xl bg-card p-3 shadow-card">
            <img src={enroll.qr} alt="Authenticator QR code" className="h-full w-full" />
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">Scan with your authenticator app, or enter this key manually:</p>
          <button
            onClick={() => {
              void navigator.clipboard?.writeText(enroll.secret).catch(() => undefined);
              toast.success("Setup key copied");
            }}
            className="mx-auto mt-3 flex max-w-full items-center gap-2 break-all rounded-full bg-primary-soft px-4 py-2 font-mono text-xs font-bold text-primary"
          >
            {enroll.secret} <Copy className="h-3.5 w-3.5 shrink-0" />
          </button>
          <div className="mt-6">
            <Field label="Enter the 6-digit code from your app">
              <OtpInput onComplete={setCode} />
            </Field>
          </div>
          <Button size="lg" fullWidth className="mt-6" disabled={code.length < 6} loading={busy} onClick={() => void verify()}>
            Verify & enable
          </Button>
        </div>
      )}

      {enabled && (
        <Button variant="danger" size="lg" fullWidth className="mt-8" loading={busy} onClick={() => void turnOff()}>
          Turn off two-factor auth
        </Button>
      )}
    </AppShell>
  );
}
