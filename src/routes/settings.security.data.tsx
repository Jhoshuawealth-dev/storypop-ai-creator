import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { exportMyData } from "@/lib/account.functions";

export const Route = createFileRoute("/settings/security/data")({
  head: pageHead("Download My Data", "Export a copy of your Storypop AI data."),
  component: DownloadData,
});

const categories = [
  { id: "profile", label: "Profile & account" },
  { id: "projects", label: "Projects & scripts" },
  { id: "characters", label: "AI characters" },
  { id: "posts", label: "Scheduled & published posts" },
  { id: "social", label: "Linked social accounts" },
  { id: "preferences", label: "Settings & preferences" },
] as const;

function DownloadData() {
  const app = useApp();
  const fetchData = useServerFn(exportMyData);
  const [selected, setSelected] = useState<Record<string, boolean>>(Object.fromEntries(categories.map((c) => [c.id, true])));
  const [busy, setBusy] = useState(false);
  const count = Object.values(selected).filter(Boolean).length;

  const download = async () => {
    setBusy(true);
    try {
      const cloud = await fetchData();
      const out: Record<string, unknown> = { exportedAt: new Date().toISOString(), app: "Storypop AI" };
      if (selected["profile"]) out["profile"] = { ...cloud.profile, email: app.user.email, credits: cloud.credits };
      if (selected["projects"]) out["projects"] = { saved: cloud.projects, onThisDevice: app.projects, generationJobs: cloud.generationJobs };
      if (selected["characters"]) out["characters"] = { saved: cloud.characters, onThisDevice: app.characters };
      if (selected["posts"]) out["posts"] = { saved: cloud.posts, onThisDevice: app.posts };
      if (selected["social"]) out["socialAccounts"] = { saved: cloud.socialAccounts, onThisDevice: app.socialAccounts };
      if (selected["preferences"]) out["preferences"] = app.preferences;
      const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `storypop-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success("Your data is downloading");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't export your data. Please sign in and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell title="Download My Data" showBack backTo="/settings/security">
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Download a copy of the information stored in your account as a single file. Video files can be downloaded from each project.
      </p>

      <SectionHeader title="What to include" />
      <div className="divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-card">
        {categories.map((cat) => {
          const on = Boolean(selected[cat.id]);
          return (
            <button key={cat.id} onClick={() => setSelected((prev) => ({ ...prev, [cat.id]: !prev[cat.id] }))} className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left">
              <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors", on ? "border-primary bg-primary" : "border-border bg-card")}>
                {on && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
              </span>
              <span className="min-w-0 flex-1 truncate font-semibold text-foreground">{cat.label}</span>
            </button>
          );
        })}
      </div>

      <Button size="lg" fullWidth className="mt-8" disabled={count === 0 || busy} onClick={() => void download()}>
        {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Preparing your file…</> : <><Download className="h-4 w-4" /> Download my data ({count} selected)</>}
      </Button>
    </AppShell>
  );
}
