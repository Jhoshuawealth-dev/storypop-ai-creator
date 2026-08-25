import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import { FlowShell } from "@/components/layout/app-shell";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/verify-email")({
  head: pageHead("Verify Email", "Enter the verification code sent to your email."),
  component: VerifyEmail,
});

function VerifyEmail() {
  const navigate = useNavigate();
  const { signIn, user } = useApp();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const verify = () => {
    if (code.length < 6) {
      toast.error("Please enter the full 6-digit code.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      signIn();
      toast.success("Email verified. Welcome to Storypop AI!");
      navigate({ to: "/home" });
    }, 1200);
  };

  return (
    <FlowShell showBack backTo="/register">
      <div className="flex flex-col items-center pt-10 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-soft">
          <MailCheck className="h-9 w-9 text-primary" strokeWidth={1.6} />
        </div>
        <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-foreground">Verify your email</h1>
        <p className="mt-2 max-w-64 text-[15px] leading-relaxed text-muted-foreground">
          We've sent a verification code to <span className="font-semibold text-foreground">{user.email}</span>.
        </p>
      </div>

      <div className="mt-9">
        <OtpInput onComplete={setCode} />
      </div>

      <Button size="lg" fullWidth className="mt-9" onClick={verify} loading={loading}>
        Verify
      </Button>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        {countdown > 0 ? (
          <p>
            Resend code in <span className="font-bold tabular-nums text-foreground">{countdown}s</span>
          </p>
        ) : (
          <button
            onClick={() => {
              setCountdown(30);
              toast.success("A new code is on its way.");
            }}
            className="font-bold text-primary"
          >
            Resend code
          </button>
        )}
      </div>

      <button
        onClick={() => navigate({ to: "/register" })}
        className="mx-auto mt-4 block text-sm font-semibold text-muted-foreground underline-offset-4 hover:underline"
      >
        Change email
      </button>
    </FlowShell>
  );
}
