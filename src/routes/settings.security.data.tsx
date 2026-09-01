import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Download, FileArchive, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings/security/data")({
  head: pageHead("Download My Data", "Export a copy of your Storypop AI data."),
  component: DownloadData,
});

const categories = [
  { id: "profile", label: "Profile & account", size: "12 KB" },
  { id: "projects", label: "Projects & scripts", size: "2.4 MB" },
  { id: "characters", label: "AI characters", size: "18 MB" },
  { id: "videos", label: "Generated videos", size: "214 MB" },
  { id: "analytics", label: "Analytics history", size: "340 KB" },
  { id: "billing", label: "Billing & invoices", size: "96 KB" },
];

type Status = "idle" | "preparing" | "ready";

function DownloadData() {
  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(categories.map((c) => [c.id, true]))
  );
  const [status, setStatus] = useState<Status>("idle");

  const count = Object.values(selected).filter(Boolean).length;

  const prepare = () => {
    setStatus("preparing");
    setTimeout(() => {
      setStatus("ready");
      toast.success("Your export is ready");
    }, 2200);
  };

  return (
    <AppShell title="Download My Data" showBack backTo="/settings/security">
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Export a copy of everything stored in your account. You'll get a single ZIP file with your selected data.
      </p>

      <SectionHeader title="What to include" />
      <div className="divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-card">
        {categories.map((cat) => {
          const on = Boolean(selected[cat.id]);
          return (
            <button
              key={cat.id}
              onClick={() => setSelected((prev) => ({ ...prev, [cat.id]: !prev[cat.id] }))}
              className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left"
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors",
                  on ? "border-primary bg-primary" : "border-border bg-card"
                )}
              >
                {on && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
              </span>
              <span className="min-w-0 flex-1 truncate font-semibold text-foreground">{cat.label}</span>
              <span className="shrink-0 text-xs font-semibold text-muted-foreground">{cat.size}</span>
            </button>
          );
        })}
      </div>

      {status === "ready" ? (
        <div className="mt-8 flex flex-col items-center rounded-2xl bg-card p-6 text-center shadow-card">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft">
            <FileArchive className="h-7 w-7 text-primary" strokeWidth={1.6} />
          </div>
          <p className="mt-3 font-bold text-foreground">storypop-export.zip</p>
          <p className="text-xs text-muted-foreground">{count} categories · link expires in 24 hours</p>
          <Button
            size="lg"
            fullWidth
            className="mt-5"
            onClick={() => {
              toast.success("Download started");
              setStatus("idle");
            }}
          >
            <Download className="h-4 w-4" /> Download ZIP
          </Button>
        </div>
      ) : (
        <Button size="lg" fullWidth className="mt-8" disabled={count === 0 || status === "preparing"} onClick={prepare}>
          {status === "preparing" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Preparing your export…
            </>
          ) : (
            <>Prepare export ({count} selected)</>
          )}
        </Button>
      )}

      <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
        Exports can take a few minutes for large video libraries. We'll keep your data private and encrypted.
      </p>
    </AppShell>
  );
}
