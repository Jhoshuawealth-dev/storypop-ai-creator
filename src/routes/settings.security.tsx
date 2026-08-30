import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Download, KeyRound, Smartphone, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Field, PasswordInput } from "@/components/ui/input";
import { SectionHeader } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/settings/security")({
  head: pageHead("Security & Privacy", "Manage your password, devices and data."),
  component: Security,
});

function Security() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");

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
        onClick={() => {
          if (next.length < 8) {
            toast.error("New password is too short.");
            return;
          }
          toast.success("Password updated");
          setCurrent("");
          setNext("");
        }}
      >
        Update password
      </Button>

      <SectionHeader title="Account protection" />
      <div className="divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-card">
        {[
          { label: "Two-factor authentication", value: "Off", icon: KeyRound },
          { label: "Active devices", value: "2 devices", icon: Smartphone },
          { label: "Download my data", value: "", icon: Download },
        ].map((row) => (
          <button
            key={row.label}
            onClick={() => toast.info(`${row.label} coming soon`)}
            className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left"
          >
            <row.icon className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.8} />
            <span className="min-w-0 flex-1 truncate font-semibold text-foreground">{row.label}</span>
            {row.value && <span className="shrink-0 text-xs font-semibold text-muted-foreground">{row.value}</span>}
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        ))}
      </div>

      <SectionHeader title="Danger zone" />
      <Button variant="danger" size="lg" fullWidth onClick={() => toast.info("Account deletion requires confirmation")}>
        <Trash2 className="h-4 w-4" /> Delete account
      </Button>
      <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
        Deleting your account permanently removes your videos, characters and analytics. This cannot be undone.
      </p>
    </AppShell>
  );
}
