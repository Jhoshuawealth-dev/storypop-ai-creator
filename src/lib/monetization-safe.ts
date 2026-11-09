/** Rules for "Monetization-Safe" scripts. Shared by the script screen (live check) and the worker prompt. */

export const BANNED_PHRASES = [
  "you won't believe",
  "you wont believe",
  "what happened next",
  "get rich quick",
  "get rich overnight",
  "overnight success",
  "secret hack",
  "they don't want you to know",
  "doctors hate",
  "100% guaranteed",
  "guaranteed results",
  "click the link before it's deleted",
  "shocking",
  "free money",
  "miracle",
  "this one trick",
];

export const MONETIZATION_SAFE_PROMPT = `Write an original, conversational short-form video script.
Rules:
- No clickbait or sensational claims. Never use these phrases: ${BANNED_PHRASES.join("; ")}.
- Structure: honest hook -> genuine perspective or useful detail -> natural call to action.
- Speak like a real person: mix short and long sentences, ask one rhetorical question, add "..." where a pause fits.
- Do not repeat the same sentence opening twice. No guarantees about money, health or results.
- Give real value the viewer can use.`;

export interface SafetyIssue {
  kind: "banned" | "repetition" | "shouting";
  text: string;
}

export function checkScript(script: { hook: string; body: string; cta: string }): SafetyIssue[] {
  const full = `${script.hook}\n${script.body}\n${script.cta}`;
  const lower = full.toLowerCase();
  const issues: SafetyIssue[] = [];

  for (const p of BANNED_PHRASES) if (lower.includes(p)) issues.push({ kind: "banned", text: p });

  const openings = new Map<string, number>();
  for (const s of full.split(/[.!?\n]+/)) {
    const words = s.trim().toLowerCase().split(/\s+/).slice(0, 3).join(" ");
    if (words.split(" ").length < 3) continue;
    openings.set(words, (openings.get(words) ?? 0) + 1);
  }
  for (const [w, n] of openings) if (n > 1) issues.push({ kind: "repetition", text: `"${w}…" used ${n} times` });

  const caps = full.match(/\b[A-Z]{4,}\b/g) ?? [];
  if (caps.length > 2) issues.push({ kind: "shouting", text: `Too many ALL-CAPS words (${caps.length})` });

  if (/!{2,}/.test(full)) issues.push({ kind: "shouting", text: "Multiple exclamation marks" });
  return issues;
}
