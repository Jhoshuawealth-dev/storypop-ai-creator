/** Temporary character-creation draft, kept for the duration of the flow. */
export interface CharacterDraft {
  photo: string;
  styleId: string;
  voiceId: string;
  name: string;
}

const KEY = "storypop:character-draft";

const empty: CharacterDraft = { photo: "", styleId: "", voiceId: "", name: "" };

export function readCharacterDraft(): CharacterDraft {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? { ...empty, ...(JSON.parse(raw) as Partial<CharacterDraft>) } : empty;
  } catch {
    return empty;
  }
}

export function saveCharacterDraft(patch: Partial<CharacterDraft>) {
  if (typeof window === "undefined") return;
  const next = { ...readCharacterDraft(), ...patch };
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
}

export function clearCharacterDraft() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(KEY);
}

/** Reads a picked image file into a data URL so it survives navigation. */
export function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.readAsDataURL(file);
  });
}
