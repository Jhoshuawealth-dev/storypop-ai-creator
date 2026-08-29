import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, SelectField } from "@/components/ui/input";
import { pageHead } from "@/lib/seo";
import { platforms } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/publish/schedule")({
  head: pageHead("Schedule", "Publish now or schedule for later."),
  component: PublishSchedule,
});

function PublishSchedule() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"now" | "later">("later");
  const [platform, setPlatform] = useState("TikTok");
  const [date, setDate] = useState("2026-05-12");
  const [time, setTime] = useState("10:00");

  return (
    <FlowShell title="Schedule" backTo="/publish/caption">
      <div className="mt-5 grid grid-cols-2 gap-1 rounded-full bg-muted p-1">
        {(["now", "later"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "h-10 rounded-full text-sm font-bold transition-all",
              mode === m ? "bg-card text-primary shadow-card" : "text-muted-foreground"
            )}
          >
            {m === "now" ? "Publish now" : "Schedule"}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <Field label="Platform">
          <SelectField options={platforms.map((p) => p.name)} value={platform} onChange={setPlatform} />
        </Field>
        {mode === "later" && (
          <>
            <Field label="Date">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="Time" hint="Your audience is most active between 6–8 PM.">
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </Field>
          </>
        )}
      </div>

      <Button
        size="lg"
        fullWidth
        className="mt-7"
        onClick={() => {
          toast.success(mode === "now" ? "Publishing your video" : "Post scheduled");
          navigate({ to: "/calendar/publishing" });
        }}
      >
        {mode === "now" ? "Publish now" : "Schedule"}
      </Button>
    </FlowShell>
  );
}
