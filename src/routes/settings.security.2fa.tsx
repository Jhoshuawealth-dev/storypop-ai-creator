import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, KeyRound, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/ui/feedback";
import { OtpInput } from "@/components/ui/otp-input";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings/security/2fa")({
  head: pageHead("Two-Factor Authentication", "Secure your Storypop AI account with two-factor authentication."),
  component: TwoFactor,
});

const SECRET = "SPAI-7K2M-9XQ4-LD3R";
const BACKUP_CODES = ["4821-9034", "7712-5568", "0394-2217", "6650-8132", "2947-6085", "1183-4429"];

function TwoFactor() {
  const [enabled, setEnabled] = useState(false);
  const [step, setStep] = useState<"intro" | "scan" | "verify">("intro");
  const [code, setCode] = useState("");

  return (
    <AppShell title="Two-Factor Authentication" showBack backTo="/settings/security">
      <div className="mt-8 flex flex-col items-center text-center">
        <div className={cn("flex h-20 w-20 items-center justify-center rounded-3xl", enabled ? "bg-primary" : "bg-primary-soft")}>
          <ShieldCheck className={cn("h-9 w-9", enabled ? "text-primary-foreground" : "text-primary")} strokeWidth={1.6} />
        </div>
        <h2 className="mt-4 font-display text-xl font-bold text-foreground">
          {enabled ? "2FA is on" : step === "intro" ? "Protect your account" : "Set up 2FA"}
        </h2>
        <p className="mt-1.5 max-w-72 text-sm leading-relaxed text-muted-foreground">
          {enabled
            ? "Your account requires a verification code at sign-in."
            : "Add an extra layer of security with an authenticator app like Google Authenticator or Authy."}
        </p>
      </div>

      {step === "intro" && !enabled && (
        <Button size="lg" fullWidth className="mt-8" onClick={() => setStep("scan")}>
          <KeyRound className="h-4 w-4" /> Set up two-factor auth
        </Button>
      )}

      {step === "scan" && (
        <div className="mt-8">
          <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-3xl bg-card shadow-card">
            <div className="grid h-32 w-32 grid-cols-6 gap-1">
              {Array.from({ length: 36 }).map((_, i) => (
                <span key={i} className={cn("rounded-[3px]", (i * 7 + 3) % 5 < 2 ? "bg-foreground" : "bg-muted")} />
              ))}
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">Scan with your authenticator app, or enter this key manually:</p>
          <button
            onClick={() => {
              void navigator.clipboard?.writeText(SECRET).catch(() => undefined);
              toast.success("Setup key copied");
            }}
            className="mx-auto mt-3 flex items-center gap-2 rounded-full bg-primary-soft px-4 py-2 font-mono text-sm font-bold text-primary"
          >
            {SECRET} <Copy className="h-3.5 w-3.5" />
          </button>
          <Button size="lg" fullWidth className="mt-8" onClick={() => setStep("verify")}>
            Continue
          </Button>
        </div>
      )}

      {step === "verify" && !enabled && (
        <div className="mt-8">
          <Field label="Enter the 6-digit code from your app">
            <OtpInput onComplete={setCode} />
          </Field>
          <Button
            size="lg"
            fullWidth
            className="mt-6"
            disabled={code.length < 6}
            onClick={() => {
              setEnabled(true);
              toast.success("Two-factor authentication enabled");
            }}
          >
            Verify & enable
          </Button>
        </div>
      )}

      {enabled && (
        <>
          <SectionHeader title="Backup codes" />
          <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
            Save these somewhere safe. Each code can be used once if you lose access to your authenticator app.
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {BACKUP_CODES.map((c) => (
              <div key={c} className="rounded-xl bg-card px-4 py-3 text-center font-mono text-sm font-bold text-foreground shadow-card">
                {c}
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => {
                void navigator.clipboard?.writeText(BACKUP_CODES.join("\n")).catch(() => undefined);
                toast.success("Backup codes copied");
              }}
            >
              <Copy className="h-4 w-4" /> Copy codes
            </Button>
            <Button
              variant="danger"
              size="lg"
              fullWidth
              onClick={() => {
                setEnabled(false);
                setStep("intro");
                setCode("");
                toast.success("Two-factor authentication disabled");
              }}
            >
              Turn off
            </Button>
          </div>
        </>
      )}
    </AppShell>
  );
}
