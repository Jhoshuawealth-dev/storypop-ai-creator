import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { deleteMyAccount } from "@/lib/account.functions";
import { useApp } from "@/lib/store";
import { ChevronRight, Download, KeyRound, Smartphone, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, PasswordInput } from "@/components/ui/input";
import { SectionHeader } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/settings/security/")({
  head: pageHead("Security & Privacy", "Manage your password, devices and data."),
  component: Security,
});

const protectionRows = [
  { label: "Two-factor authentication", value: "", icon: KeyRound, to: "/settings/security/2fa" },
  { label: "Active devices", value: "", icon: Smartphone, to: "/settings/security/devices" },
  { label: "Download my data", value: "", icon: Download, to: "/settings/security/data" },
] as const;

function Security() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [mfaOn, setMfaOn] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { signOut } = useApp();
  const removeAccount = useServerFn(deleteMyAccount);

  useEffect(() => {
    void supabase.auth.mfa.listFactors().then(({ data }) => setMfaOn(Boolean(data?.totp.some((f) => f.status === "verified"))));
  }, []);

  const changePassword = async () => {
    if (!current) return void toast.error("Enter your current password.");
    if (next.length < 8) return void toast.error("New password must be at least 8 characters.");
    if (next === current) return void toast.error("Choose a password different from your current one.");
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    const email = u.user?.email;
    if (!email) {
      setSaving(false);
      return void toast.error("Please sign in again.");
    }
    // Confirm the current password before changing it.
    const { error: authErr } = await supabase.auth.signInWithPassword({ email, password: current });
    if (authErr) {
      setSaving(false);
      return void toast.error("Your current password is incorrect.");
    }
    const { error } = await supabase.auth.updateUser({ password: next, current_password: current } as { password: string });
    setSaving(false);
    if (error) return void toast.error(error.message);
    toast.success("Password updated");
    setCurrent("");
    setNext("");
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      await removeAccount({ data: { confirm: "DELETE" } });
      try { localStorage.clear(); } catch { /* ignore */ }
      signOut();
      toast.success("Your account has been deleted.");
      navigate({ to: "/", replace: true });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete your account.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AppShell title="Security & Privacy" showBack backTo="/profile">
      <SectionHeader title="Change password" />
      <div className="space-y-4">
        <Field label="Current password">
          <PasswordInput value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="••••••••" />
        </Field>
        <Field label="New password" hint="At least 8 characters with a number and a symbol.">
          <PasswordInput value={next} onChange={(e) => setNext(e.target.value)} placeholder="••••••••" />
        </Field>
      </div>
      <Button
        size="lg"
        fullWidth
        className="mt-4"
        loading={saving}
        onClick={() => void changePassword()}
      >
        Update password
      </Button>

      <SectionHeader title="Account protection" />
      <div className="divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-card">
        {protectionRows.map((row) => (
          <Link key={row.label} to={row.to} className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left">
            <row.icon className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.8} />
            <span className="min-w-0 flex-1 truncate font-semibold text-foreground">{row.label}</span>
            {(row.label.startsWith("Two") ? (mfaOn === null ? "" : mfaOn ? "On" : "Off") : row.value) && <span className="shrink-0 text-xs font-semibold text-muted-foreground">{row.label.startsWith("Two") ? (mfaOn ? "On" : "Off") : row.value}</span>}
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </div>

      <SectionHeader title="Danger zone" />
      <Button variant="danger" size="lg" fullWidth onClick={() => setConfirmDelete(true)}>
        <Trash2 className="h-4 w-4" /> Delete account
      </Button>
      <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
        Deleting your account permanently removes your videos, characters and analytics. This cannot be undone.
      </p>

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 px-5 pb-10 backdrop-blur-sm"
          onClick={() => setConfirmDelete(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
              <Trash2 className="h-6 w-6 text-destructive" />
            </div>
            <h2 className="mt-4 text-center font-display text-xl font-bold text-foreground">Delete your account?</h2>
            <p className="mt-1.5 text-center text-sm leading-relaxed text-muted-foreground">
              This permanently removes all your videos, characters and analytics. Type <span className="font-bold text-foreground">DELETE</span> to confirm.
            </p>
            <div className="mt-4">
              <Input value={deleteText} onChange={(e) => setDeleteText(e.target.value)} placeholder="Type DELETE" />
            </div>
            <Button
              variant="danger"
              size="lg"
              fullWidth
              className="mt-4"
              disabled={deleteText !== "DELETE" || deleting}
              loading={deleting}
              onClick={() => void doDelete()}
            >
              Permanently delete account
            </Button>
            <Button variant="ghost" size="md" fullWidth className="mt-1" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
