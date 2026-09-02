import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, SelectField, TextArea } from "@/components/ui/input";
import { pageHead } from "@/lib/seo";
import { currentUser } from "@/lib/mock-data";

export const Route = createFileRoute("/settings/")({
  head: pageHead("Account Settings", "Update your Storypop AI profile details."),
  component: AccountSettings,
});

function AccountSettings() {
  const [name, setName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [bio, setBio] = useState("Creator building product stories with AI.");
  const [language, setLanguage] = useState("English");
  const [photo, setPhoto] = useState(currentUser.avatar);

  const pickPhoto = (file: File | undefined) => {
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
    toast.success("Profile photo updated");
  };

  return (
    <AppShell title="Account Settings" showBack backTo="/profile">
      <div className="mt-5 flex flex-col items-center">
        <img
          src={photo}
          alt={currentUser.fullName}
          className="h-24 w-24 rounded-3xl object-cover shadow-card"
          width={96}
          height={96}
        />
        <label className="mt-2.5 cursor-pointer">
          <span className="text-sm font-semibold text-primary">Change photo</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => pickPhoto(e.target.files?.[0])}
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

      <Button size="lg" fullWidth className="mt-6" onClick={() => toast.success("Changes saved")}>
        Save changes
      </Button>
    </AppShell>
  );
}
