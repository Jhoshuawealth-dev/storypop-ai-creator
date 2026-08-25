import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, Input, PasswordInput } from "@/components/ui/input";
import { LogoMark } from "@/components/logo";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";
import { AppleIcon, GoogleIcon } from "./register";

export const Route = createFileRoute("/login")({
  head: pageHead("Sign In", "Sign in to continue creating with Storypop AI."),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { signIn } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    const next: Record<string, string> = {};
    if (!email) next["email"] = "Please enter your email address.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next["email"] = "Please enter a valid email address.";
    if (!password) next["password"] = "Please enter your password.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      // Mock auth: any valid-looking credentials succeed
      signIn();
      toast.success("Welcome back, Joshua!");
      navigate({ to: "/home" });
    }, 1200);
  };

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-background px-6 pb-10 pt-8">
      <LogoMark />
      <h1 className="mt-8 font-display text-2xl font-extrabold tracking-tight text-foreground">Welcome back</h1>
      <p className="mt-1.5 text-[15px] text-muted-foreground">Sign in to continue creating with Storypop AI.</p>

      <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
        <Field label="Email" error={errors["email"]}>
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
            placeholder="Your password"
            invalid={!!errors["password"]}
            autoComplete="current-password"
          />
        </Field>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => toast.info("Password reset link sent to your email.")}
            className="text-sm font-semibold text-primary"
          >
            Forgot password?
          </button>
        </div>

        {formError && (
          <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{formError}</p>
        )}

        <Button type="submit" size="lg" fullWidth loading={loading}>
          {loading ? "Signing you in..." : "Sign In"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-bold tracking-widest text-muted-foreground">OR</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="space-y-3">
        <Button variant="outline" size="lg" fullWidth onClick={() => { signIn(); navigate({ to: "/home" }); }}>
          <GoogleIcon /> Continue with Google
        </Button>
        <Button variant="outline" size="lg" fullWidth onClick={() => { signIn(); navigate({ to: "/home" }); }}>
          <AppleIcon /> Continue with Apple
        </Button>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/register" className="font-bold text-primary">
          Create Account
        </Link>
      </p>
    </div>
  );
}
