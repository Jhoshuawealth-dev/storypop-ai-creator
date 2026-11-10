import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, SelectField, TextArea } from "@/components/ui/input";
import { useApp } from "@/lib/store";

export interface SettingsField {
  key: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  /** Renders a dropdown with these choices. */
  options?: string[];
  /** Renders an on/off switch. */
  toggle?: boolean;
  /** With options: choosing "Other" shows a free-text box. */
  allowOther?: boolean;
  hint?: string;
}

export function SettingsSection({
  title,
  description,
  fields,
  notice,
  links = [],
}: {
  title: string;
  description: string;
  fields?: SettingsField[];
  notice?: string;
  links?: { label: string; to: string }[];
}) {
  const { preferences, updatePreference } = useApp();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries((fields ?? []).flatMap((field) => [[field.key, String(preferences[field.key] ?? "")], [`${field.key}.other`, String(preferences[`${field.key}.other`] ?? "")]]))
  );
  const [saved, setSaved] = useState(false);

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    for (const field of fields ?? []) {
      updatePreference(field.key, values[field.key] || field.options?.[0] || "");
      if (field.allowOther) updatePreference(`${field.key}.other`, values[`${field.key}.other`] ?? "");
    }
    setSaved(true);
  };

  return (
    <AppShell title={title} showBack backTo="/settings">
      <div className="mx-auto w-full max-w-3xl pb-10 pt-6">
        <h1 className="font-display text-2xl font-extrabold text-foreground">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>

        {fields && fields.length > 0 && (
          <form onSubmit={save} className="mt-6 space-y-4">
            {fields.map((field) => (
              <Field key={field.key} label={field.label} hint={field.hint}>
                {field.toggle ? (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={values[field.key] === "true"}
                    onClick={() => {
                      setValues((current) => ({ ...current, [field.key]: current[field.key] === "true" ? "false" : "true" }));
                      setSaved(false);
                    }}
                    className={`relative h-7 w-12 rounded-full transition-colors ${values[field.key] === "true" ? "bg-primary" : "bg-muted"}`}
                  >
                    <span className={`absolute top-1 h-5 w-5 rounded-full bg-card shadow-card transition-all ${values[field.key] === "true" ? "left-6" : "left-1"}`} />
                  </button>
                ) : field.options ? (
                  <div className="space-y-2">
                    <SelectField
                      options={field.allowOther ? [...field.options, "Other"] : field.options}
                      value={values[field.key] || field.options[0] || ""}
                      onChange={(value) => {
                        setValues((current) => ({ ...current, [field.key]: value }));
                        setSaved(false);
                      }}
                    />
                    {field.allowOther && values[field.key] === "Other" && (
                      <Input
                        value={values[`${field.key}.other`] ?? ""}
                        placeholder="Type your own"
                        onChange={(event) => {
                          setValues((current) => ({ ...current, [`${field.key}.other`]: event.target.value }));
                          setSaved(false);
                        }}
                      />
                    )}
                  </div>
                ) : field.multiline ? (
                  <TextArea
                    rows={4}
                    value={values[field.key] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(event) => {
                      setValues((current) => ({ ...current, [field.key]: event.target.value }));
                      setSaved(false);
                    }}
                  />
                ) : (
                  <Input
                    value={values[field.key] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(event) => {
                      setValues((current) => ({ ...current, [field.key]: event.target.value }));
                      setSaved(false);
                    }}
                  />
                )}
              </Field>
            ))}
            <Button type="submit" size="lg">
              {saved ? <><Check className="h-4 w-4" /> Saved on this device</> : "Save changes"}
            </Button>
          </form>
        )}

        {notice && <p className="mt-6 rounded-md border border-border bg-muted/50 p-4 text-sm leading-relaxed text-muted-foreground">{notice}</p>}

        {links.length > 0 && (
          <nav aria-label={`${title} related settings`} className="mt-6 divide-y divide-border border-y border-border">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className="flex items-center gap-3 py-4 font-semibold text-foreground">
                <span className="min-w-0 flex-1">{link.label}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </nav>
        )}
      </div>
    </AppShell>
  );
}