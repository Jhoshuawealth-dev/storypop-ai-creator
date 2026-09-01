import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Laptop, Smartphone, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings/security/devices")({
  head: pageHead("Active Devices", "See and manage devices signed in to Storypop AI."),
  component: Devices,
});

interface Device {
  id: string;
  name: string;
  meta: string;
  lastActive: string;
  current?: boolean;
  icon: "phone" | "laptop";
}

const initialDevices: Device[] = [
  { id: "d1", name: "iPhone 15 Pro", meta: "Lagos, Nigeria · Storypop App", lastActive: "Active now", current: true, icon: "phone" },
  { id: "d2", name: "MacBook Pro", meta: "Lagos, Nigeria · Chrome", lastActive: "2 hours ago", icon: "laptop" },
  { id: "d3", name: "Samsung Galaxy S24", meta: "Abuja, Nigeria · Storypop App", lastActive: "3 days ago", icon: "phone" },
];

function Devices() {
  const [devices, setDevices] = useState(initialDevices);

  const revoke = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    toast.success("Device signed out");
  };

  return (
    <AppShell title="Active Devices" showBack backTo="/settings/security">
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        These devices are currently signed in to your account. Remove any device you don't recognise.
      </p>

      <SectionHeader title={`Signed in (${devices.length})`} />
      <div className="space-y-3">
        {devices.map((device) => (
          <div key={device.id} className="flex items-center gap-3.5 rounded-2xl bg-card p-4 shadow-card">
            <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", device.current ? "bg-primary" : "bg-primary-soft")}>
              {device.icon === "phone" ? (
                <Smartphone className={cn("h-5 w-5", device.current ? "text-primary-foreground" : "text-primary")} strokeWidth={1.8} />
              ) : (
                <Laptop className={cn("h-5 w-5", device.current ? "text-primary-foreground" : "text-primary")} strokeWidth={1.8} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-foreground">
                {device.name}
                {device.current && <span className="ml-2 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-primary">This device</span>}
              </p>
              <p className="truncate text-xs text-muted-foreground">{device.meta}</p>
              <p className="text-xs font-semibold text-muted-foreground">{device.lastActive}</p>
            </div>
            {!device.current && (
              <button
                onClick={() => revoke(device.id)}
                aria-label={`Sign out ${device.name}`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="lg"
        fullWidth
        className="mt-8"
        onClick={() => {
          setDevices((prev) => prev.filter((d) => d.current));
          toast.success("Signed out of all other devices");
        }}
      >
        Sign out all other devices
      </Button>
    </AppShell>
  );
}
