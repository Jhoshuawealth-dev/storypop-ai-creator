import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { LogoMark } from "@/components/logo";
import { pageHead } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  head: pageHead("Forgot Password", "Reset your Storypop AI password by email."),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Please enter a valid email address.");
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (err) {
      setError(err.status === 429 ? "Too many requests. Please wait a few minutes and try again." : err.message);
      return;
    }
    setSent(true);
  };

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-background px-6 pb-10 pt-8">
      <LogoMark />
      {sent ? (
        <div className="mt-12 flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-soft">
            <MailCheck className="h-9 w-9 text-primary" strokeWidth={1.6} />
          </div>
          <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-foreground">Check your email</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            If an account exists for <span className="font-semibold text-foreground">{email.trim()}</span>, we've sent a link to reset your password. Check your spam folder too.
          </p>
          <Button variant="outline" size="lg" fullWidth className="mt-8" onClick={() => setSent(false)}>
            Use a different email
          </Button>
        </div>
      ) : (
        <>
          <h1 className="mt-8 font-display text-2xl font-extrabold tracking-tight text-foreground">Forgot your password?</h1>
          <p className="mt-1.5 text-[15px] text-muted-foreground">Enter your email and we'll send you a link to set a new one.</p>
          <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
            <Field label="Email" error={error || undefined}>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" invalid={!!error} autoComplete="email" />
            </Field>
            <Button type="submit" size="lg" fullWidth loading={loading}>
              {loading ? "Sending link..." : "Send reset link"}
            </Button>
          </form>
        </>
      )}
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link to="/login" className="font-bold text-primary">Back to Sign In</Link>
      </p>
    </div>
  );
}
