import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, PasswordInput } from "@/components/ui/input";
import { LogoMark } from "@/components/logo";
import { pageHead } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: pageHead("Set New Password", "Choose a new password for your Storypop AI account."),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState<"checking" | "ok" | "invalid">("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("error")) return setReady("invalid");
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (session && hash.includes("type=recovery"))) setReady("ok");
    });
    const t = setTimeout(async () => {
      const { data: s } = await supabase.auth.getSession();
      setReady((r) => (r === "checking" ? (s.session ? "ok" : "invalid") : r));
    }, 1500);
    return () => {
      clearTimeout(t);
      data.subscription.unsubscribe();
    };
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (password.length < 8) next["password"] = "Password must contain at least 8 characters.";
    if (confirm !== password) next["confirm"] = "Passwords don't match.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return setErrors({ password: error.message });
    toast.success("Password updated. You're signed in.");
    navigate({ to: "/home" });
  };

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-background px-6 pb-10 pt-8">
      <LogoMark />
      <h1 className="mt-8 font-display text-2xl font-extrabold tracking-tight text-foreground">Set a new password</h1>
      {ready === "invalid" ? (
        <>
          <p className="mt-2 text-[15px] text-muted-foreground">This reset link is invalid or has expired. Request a new one to continue.</p>
          <Link to="/forgot-password"><Button size="lg" fullWidth className="mt-7">Request a new link</Button></Link>
        </>
      ) : ready === "checking" ? (
        <p className="mt-2 text-[15px] text-muted-foreground">Checking your reset link…</p>
      ) : (
        <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
          <Field label="New password" error={errors["password"]}>
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" invalid={!!errors["password"]} autoComplete="new-password" />
          </Field>
          <Field label="Confirm new password" error={errors["confirm"]}>
            <PasswordInput value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat your password" invalid={!!errors["confirm"]} autoComplete="new-password" />
          </Field>
          <Button type="submit" size="lg" fullWidth loading={loading}>
            {loading ? "Saving..." : "Save new password"}
          </Button>
        </form>
      )}
    </div>
  );
}
