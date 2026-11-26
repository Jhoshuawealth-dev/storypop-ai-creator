import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { FlowShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute("/calendar/publishing")({
  head: pageHead("Publishing Status", "Track posts that are queued for publishing."),
  component: PublishingStatus,
});

function PublishingStatus() {
  const { posts, updatePost } = useApp();
  const [links, setLinks] = useState<Record<string, string>>({});
  const queued = posts.filter((p) => p.status === 'scheduled' || p.status === 'draft');

  return (
    <FlowShell title="Publishing Status" backTo="/calendar">
      {queued.length === 0 ? (
        <EmptyState
          icon={Send}
          title="Nothing is publishing"
          description="Scheduled posts will appear here. Direct publishing starts once your social accounts are linked to a live service."
          actionLabel="Schedule a post"
          actionTo="/calendar/schedule"
          className="mt-10"
        />
      ) : (
        <div className="mt-5 space-y-3">
          {queued.map((p) => (
            <div key={p.id} className="rounded-2xl bg-card p-4 shadow-card">
              <p className="truncate font-bold text-foreground">{p.title || "Untitled post"}</p>
              <p className="text-xs text-muted-foreground">
                {p.platform} · {p.date} {p.time} · {p.status === 'draft' ? 'Awaiting manual upload' : 'Manual upload scheduled'}
              </p>
              <Input className="mt-3" aria-label={`Live post link for ${p.title}`} placeholder="Paste the live post link" value={links[p.id] ?? ''} onChange={(event) => setLinks((prev) => ({ ...prev, [p.id]: event.target.value }))} />
              <Button className="mt-2" size="sm" variant="outline" onClick={() => {
                const link = (links[p.id] ?? '').trim();
                try { const url = new URL(link); if (url.protocol !== 'https:') throw new Error('Invalid URL'); }
                catch { toast.error('Paste a valid HTTPS link to your published post.'); return; }
                updatePost(p.id, { status: 'published', postUrl: link });
                toast.success('Marked as published — confirmed by you');
              }}>Confirm published</Button>
            </div>
          ))}
        </div>
      )}
    </FlowShell>
  );
}
