import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Send, TriangleAlert } from "lucide-react";
import { z } from "zod";
import { LogoMark } from "@/components/logo";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  head: pageHead("Contact Us", "Send the Storypop AI team a message — we read every submission from this form."),
  component: ContactPage,
});

const formSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name (at least 2 characters).").max(100, "Name must be under 100 characters."),
  email: z.string().trim().max(255, "Email must be under 255 characters.").email("Please enter a valid email address."),
  subject: z.string().trim().min(1, "Please choose a subject.").max(100),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters so we can help.")
    .max(2000, "Message must be under 2,000 characters."),
});

type FormValues = z.infer<typeof formSchema>;

const subjects = [
  "General question",
  "Billing & plans",
  "Technical issue",
  "Feature request",
  "Report a problem",
  "Partnership",
] as const;

type SubmitState = "idle" | "sending" | "success" | "error";

function ContactPage() {
  const [values, setValues] = useState<FormValues>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [state, setState] = useState<SubmitState>("idle");

  const setField = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormValues | undefined;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setState("sending");
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setState("success");
    } catch {
      setState("error");
    }
  };

  const inputClass = (field: keyof FormValues) =>
    cn("rounded-2xl border-border bg-card", errors[field] && "border-destructive focus-visible:ring-destructive");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between px-5 py-4 md:px-8">
        <Link to="/" aria-label="Storypop AI home">
          <LogoMark />
        </Link>
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-20 md:px-8">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">Contact us</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Have a question, a bug to report, or feedback to share? Send us a message using this form and it goes straight to the Storypop AI team inbox.
        </p>

        {state === "success" ? (
          <div className="mt-10 rounded-3xl bg-card p-8 text-center shadow-card">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-4 font-display text-xl font-bold text-foreground">Message sent</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Thanks for reaching out. Your message is with the team — we'll get back to you by email.
            </p>
            <Link to="/" className="mt-6 inline-block">
              <Button variant="outline">Back to home</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5 rounded-3xl bg-card p-6 shadow-card md:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Your name</Label>
                <Input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  maxLength={100}
                  value={values.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="Ada Obi"
                  className={inputClass("name")}
                />
                {errors.name && <p className="text-xs font-medium text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email address</Label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={255}
                  value={values.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass("email")}
                />
                {errors.email && <p className="text-xs font-medium text-destructive">{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-subject">Subject</Label>
              <Select value={values.subject} onValueChange={(v) => setField("subject", v)}>
                <SelectTrigger id="contact-subject" className={cn("w-full rounded-2xl bg-card", errors.subject && "border-destructive")}>
                  <SelectValue placeholder="What is this about?" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subject && <p className="text-xs font-medium text-destructive">{errors.subject}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                name="message"
                rows={6}
                maxLength={2000}
                value={values.message}
                onChange={(e) => setField("message", e.target.value)}
                placeholder="Tell us what's on your mind…"
                className={cn("resize-none rounded-2xl", errors.message && "border-destructive focus-visible:ring-destructive")}
              />
              <div className="flex items-center justify-between">
                {errors.message ? (
                  <p className="text-xs font-medium text-destructive">{errors.message}</p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-muted-foreground">{values.message.length}/2,000</span>
              </div>
            </div>

            {state === "error" && (
              <div className="flex items-start gap-2 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                Something went wrong sending your message. Please try again in a moment.
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : (
                <>
                  <Send className="h-4 w-4" /> Send message
                </>
              )}
            </Button>
          </form>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
