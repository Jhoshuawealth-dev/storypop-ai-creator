import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { platformSpecs } from "@/lib/catalog";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/settings/social")({
  head: pageHead("Social Accounts", "Link as many TikTok, Instagram, YouTube and Facebook accounts as you need."),
  component: SocialAccounts,
});

function SocialAccounts() {
  const { socialAccounts, addSocialAccount, removeSocialAccount } = useApp();
  const [adding, setAdding] = useState<string | null>(null);
  const [handle, setHandle] = useState("");

  const submit = (platform: string, name: string) => {
    if (handle.trim().replace("@", "").length < 2) {
      toast.error("Enter the account's username.");
      return;
    }
    if (!addSocialAccount(platform, handle)) {
      toast.error(`That ${name} account is already linked.`);
      return;
    }
    toast.success(`${name} account added`);
    setHandle("");
    setAdding(null);
  };

  return (
    <AppShell title="Social Accounts" showBack backTo="/settings">
      <div className="mx-auto w-full max-w-3xl pb-10">
        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
          Add every account you post to — personal pages, brand pages, client pages. You can pick which ones to use each time you publish.
        </p>

        <div className="mt-5 space-y-4">
          {platformSpecs.map((p) => {
            const accounts = socialAccounts.filter((a) => a.platform === p.id);
            return (
              <section key={p.id} className="rounded-2xl bg-card p-4 shadow-card">
                <div className="flex items-center gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft font-display text-sm font-extrabold text-primary">
                    {p.name.slice(0, 2)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {accounts.length === 0 ? "No accounts added" : `${accounts.length} account${accounts.length > 1 ? "s" : ""}`}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => { setAdding(adding === p.id ? null : p.id); setHandle(""); }}>
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>

                {accounts.length > 0 && (
                  <ul className="mt-3 divide-y divide-border border-t border-border">
                    {accounts.map((a) => (
                      <li key={a.id} className="flex items-center gap-3 py-3">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        <span className="min-w-0 flex-1 truncate font-semibold text-foreground">{a.handle}</span>
                        <button
                          aria-label={`Remove ${a.handle}`}
                          onClick={() => { removeSocialAccount(a.id); toast.success(`${a.handle} removed`); }}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {adding === p.id && (
                  <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); submit(p.id, p.name); }}>
                    <Input autoFocus placeholder={`@your${p.id}handle`} value={handle} onChange={(e) => setHandle(e.target.value)} />
                    <Button type="submit">Save</Button>
                  </form>
                )}
              </section>
            );
          })}
        </div>

        <p className="mt-6 rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
          Accounts are saved on this device. Posting directly to each platform switches on once Storypop AI is linked to the live social services.
        </p>
      </div>
    </AppShell>
  );
}
