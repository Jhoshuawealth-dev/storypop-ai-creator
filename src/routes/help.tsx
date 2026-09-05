import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Mail, MessageCircle, Search, Send, X } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { faqs } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/help")({
  head: pageHead("Help & Support", "Find answers or contact the Storypop AI team."),
  component: Help,
});

interface ChatMessage {
  from: "user" | "support";
  text: string;
}

const cannedReplies = [
  "Hi! I'm Poppy from Storypop support. How can I help you today?",
  "Got it — let me look into that for you. Anything else you'd like to add?",
  "Thanks! I've passed this to the team and we'll follow up by email shortly.",
];

function Help() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<number | null>(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ from: "support", text: cannedReplies[0]! }]);
  const [draft, setDraft] = useState("");

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    const reply = cannedReplies[Math.min(messages.filter((m) => m.from === "user").length, cannedReplies.length - 1)]!;
    setMessages((prev) => [...prev, { from: "user", text }, { from: "support", text: reply }]);
    setDraft("");
  };

  const results = faqs.filter(
    (f) => f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AppShell title="Help & Support" showBack backTo="/profile">
      <div className="relative mt-5">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search help articles"
          className="pl-11"
        />
      </div>

      <SectionHeader title="Frequently asked" />
      <div className="space-y-2.5">
        {results.length === 0 && (
          <p className="rounded-2xl bg-card p-4 text-sm text-muted-foreground shadow-card">
            No articles matched “{query}”. Try a different search or contact support.
          </p>
        )}
        {results.map((f, i) => (
          <div key={f.q} className="overflow-hidden rounded-2xl bg-card shadow-card">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
              aria-expanded={open === i}
            >
              <span className="min-w-0 flex-1 font-semibold text-foreground">{f.q}</span>
              <ChevronDown
                className={cn("h-4.5 w-4.5 shrink-0 text-muted-foreground transition-transform", open === i && "rotate-180")}
              />
            </button>
            {open === i && <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{f.a}</p>}
          </div>
        ))}
      </div>

      <SectionHeader title="Still need help?" />
      <div className="space-y-3">
        <Button variant="outline" size="lg" fullWidth onClick={() => setChatOpen(true)}>
          <MessageCircle className="h-4 w-4" /> Chat with support
        </Button>
        <a href="mailto:support@storypop.ai" className="block">
          <Button variant="outline" size="lg" fullWidth>
            <Mail className="h-4 w-4" /> Email support
          </Button>
        </a>
      </div>

      {chatOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm"
          onClick={() => setChatOpen(false)}
        >
          <div
            className="flex h-[70dvh] w-full max-w-md flex-col rounded-t-3xl bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft">
                <MessageCircle className="h-5 w-5 text-primary" strokeWidth={1.8} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-foreground">Storypop Support</p>
                <p className="text-xs font-semibold text-primary">Online · replies in minutes</p>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                aria-label="Close chat"
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}>
                  <p
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      m.from === "user"
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md bg-muted text-foreground"
                    )}
                  >
                    {m.text}
                  </p>
                </div>
              ))}
            </div>
            <form
              className="flex items-center gap-2.5 border-t border-border px-5 py-3.5"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message…" className="flex-1" />
              <button
                type="submit"
                aria-label="Send message"
                disabled={!draft.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
