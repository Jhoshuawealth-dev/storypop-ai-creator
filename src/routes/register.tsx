import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, PasswordInput } from "@/components/ui/input";
import { LogoMark } from "@/components/logo";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  head: pageHead("Create Account", "Start creating your AI-powered UGC content."),
  component: Register,
});

function strengthOf(pw: string): { score: number; label: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Too weak", "Weak", "Okay", "Strong", "Very strong"];
  return { score, label: labels[score] ?? "Too weak" };
}

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const strength = strengthOf(password);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next["name"] = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next["email"] = "Please enter a valid email address.";
    if (password.length < 8) next["password"] = "Password must contain at least 8 characters.";
    if (confirm !== password) next["confirm"] = "Passwords don't match.";
    if (!terms) next["terms"] = "Please accept the Terms of Service to continue.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    setTimeout(() => navigate({ to: "/verify-email" }), 1400);
  };

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-background px-6 pb-10 pt-8">
      <LogoMark />
      <h1 className="mt-8 font-display text-2xl font-extrabold tracking-tight text-foreground">
        Create your Storypop AI account
      </h1>
      <p className="mt-1.5 text-[15px] text-muted-foreground">Start creating your AI-powered UGC content.</p>

      <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
        <Field label="Full name" error={errors["name"]}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Joshua Adeyemi"
            invalid={!!errors["name"]}
            autoComplete="name"
          />
        </Field>
        <Field label="Email address" error={errors["email"]}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            invalid={!!errors["email"]}
            autoComplete="email"
          />
        </Field>
        <Field label="Password" error={errors["password"]}>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            invalid={!!errors["password"]}
            autoComplete="new-password"
          />
          {password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-colors",
                      i < strength.score ? "bg-primary" : "bg-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{strength.label}</span>
            </div>
          )}
        </Field>
        <Field label="Confirm password" error={errors["confirm"]}>
          <PasswordInput
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat your password"
            invalid={!!errors["confirm"]}
            autoComplete="new-password"
          />
        </Field>

        <label className="flex cursor-pointer items-start gap-3 pt-1">
          <span
            onClick={() => setTerms((t) => !t)}
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
              terms ? "border-primary bg-primary" : "border-input bg-card"
            )}
          >
            {terms && <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />}
          </span>
          <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="sr-only" />
          <span className="text-sm leading-snug text-muted-foreground">
            I agree to Storypop AI's <span className="font-semibold text-primary">Terms of Service</span> and{" "}
            <span className="font-semibold text-primary">Privacy Policy</span>.
          </span>
        </label>
        {errors["terms"] && <p className="text-sm font-medium text-destructive">{errors["terms"]}</p>}

        <Button type="submit" size="lg" fullWidth loading={loading} className="pt-0">
          {loading ? "Creating your account..." : "Create Account"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-bold tracking-widest text-muted-foreground">OR</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="space-y-3">
        <Button variant="outline" size="lg" fullWidth>
          <GoogleIcon /> Continue with Google
        </Button>
        <Button variant="outline" size="lg" fullWidth>
          <AppleIcon /> Continue with Apple
        </Button>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-primary">
          Sign In
        </Link>
      </p>
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
      />
    </svg>
  );
}

export function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" />
    </svg>
  );
}
