import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, SelectField, TextArea } from "@/components/ui/input";
import { pageHead } from "@/lib/seo";
import { Avatar } from "@/components/ui/avatar";
import { useApp } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/settings/profile")({
  head: pageHead("Profile Settings", "Update your Storypop AI profile details."),
  component: AccountSettings,
});

function AccountSettings() {
  const { user, updateUser } = useApp();
  const [name, setName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio);
  const [language, setLanguage] = useState(user.language || "English");
  const [photo, setPhoto] = useState(user.avatar);

  useEffect(() => {
    setName(user.fullName);
    setEmail(user.email);
    setBio(user.bio);
    setLanguage(user.language || "English");
    setPhoto(user.avatar);
  }, [user]);

  const [uploading, setUploading] = useState(false);

  const pickPhoto = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return void toast.error("Please choose an image file.");
    if (file.size > 5 * 1024 * 1024) return void toast.error("Photo must be under 5 MB.");
    setUploading(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Please sign in to change your photo.");
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `${auth.user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { error: dbErr } = await supabase
        .from("profiles")
        .upsert({ id: auth.user.id, avatar_url: `storage:${path}`, updated_at: new Date().toISOString() });
      if (dbErr) throw dbErr;
      const { data: signed } = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60 * 24 * 7);
      const url = signed?.signedUrl ?? "";
      setPhoto(url);
      updateUser({ avatar: url });
      toast.success("Profile photo saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't upload your photo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AppShell title="Profile" showBack backTo="/settings">
      <div className="mt-5 flex flex-col items-center">
        <Avatar src={photo} name={name} className="h-24 w-24 rounded-3xl text-2xl shadow-card" />
        <label className="mt-2.5 cursor-pointer">
          <span className="text-sm font-semibold text-primary">{uploading ? "Uploading…" : "Change photo"}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => void pickPhoto(e.target.files?.[0])}
          />
        </label>
      </div>

      <div className="mt-4 space-y-4">
        <Field label="Full name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Email">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Bio" hint="Used to personalise AI script suggestions.">
          <TextArea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
        </Field>
        <Field label="Language">
          <SelectField options={["English", "French", "Spanish", "Portuguese"]} value={language} onChange={setLanguage} />
        </Field>
      </div>

      <Button size="lg" fullWidth className="mt-6" onClick={() => {
          if (!name.trim()) {
            toast.error("Please enter your full name.");
            return;
          }
          updateUser({ fullName: name.trim(), name: name.trim().split(" ")[0] ?? "", email: email.trim(), bio, language });
          toast.success("Changes saved");
        }}>
        Save changes
      </Button>
    </AppShell>
  );
}
