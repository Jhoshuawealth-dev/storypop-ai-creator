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
    // Accept a full profile link (e.g. https://tiktok.com/@brand) or a plain handle.
    const raw = handle.trim();
    const fromUrl = raw.match(/^https?:\/\/[^/]+\/(?:c\/|channel\/|user\/)?@?([^/?#]+)/i)?.[1];
    const value = fromUrl ?? raw;
    if (value.replace("@", "").length < 2) {
      toast.error("Paste your profile link or username.");
      return;
    }
    if (!addSocialAccount(platform, value)) {
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
          Save the profiles you post to. A profile link does not authorize Storypop to publish or read private analytics.
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
                        <span className="min-w-0 flex-1"><span className="block truncate font-semibold text-foreground">{a.handle}</span><span className="text-xs text-muted-foreground">Saved profile · Manual upload only</span></span>
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
                    <Input autoFocus placeholder={`Paste your ${p.name} profile link or @handle`} value={handle} onChange={(e) => setHandle(e.target.value)} />
                    <Button type="submit">Save</Button>
                  </form>
                )}
              </section>
            );
          })}
        </div>

        <p className="mt-6 rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
          Saved profiles sync across your signed-in devices. Direct publishing and automatic analytics require approved account authorization.
        </p>
        <section className="mt-6 border-t border-border pt-5">
          <h2 className="font-display text-lg font-bold text-foreground">Direct connection requirements</h2>
          <dl className="mt-3 space-y-4 text-sm">
            <div><dt className="font-semibold text-foreground">TikTok</dt><dd className="text-muted-foreground">Not configured. Requires a TikTok developer app, approved Content Posting access, video.publish and video.list permissions, and each user's consent. Unaudited clients have publishing restrictions.</dd></div>
            <div><dt className="font-semibold text-foreground">LinkedIn</dt><dd className="text-muted-foreground">Not configured. Requires a LinkedIn developer app with Share on LinkedIn access and member consent. Organization posting and analytics require additional Community Management approval.</dd></div>
            <div><dt className="font-semibold text-foreground">X</dt><dd className="text-muted-foreground">Not configured. Requires an X developer app, user posting permissions and an API plan that supports media uploads and the metrics requested.</dd></div>
            <div><dt className="font-semibold text-foreground">YouTube, Instagram and Facebook</dt><dd className="text-muted-foreground">Manual upload for now. Custom account authorization is deferred; provider app registration, review and eligible account permissions will be needed.</dd></div>
          </dl>
        </section>
      </div>
    </AppShell>
  );
}
