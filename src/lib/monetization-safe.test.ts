import { describe, expect, it } from "vitest";
import { checkScript } from "./monetization-safe";

describe("checkScript", () => {
  it("flags clickbait phrases", () => {
    const r = checkScript({ hook: "You won't believe this", body: "", cta: "" });
    expect(r.some((i) => i.kind === "banned")).toBe(true);
  });
  it("flags repeated sentence openings", () => {
    const r = checkScript({ hook: "Here is why it works.", body: "Here is why it matters.", cta: "" });
    expect(r.some((i) => i.kind === "repetition")).toBe(true);
  });
  it("passes a clean script", () => {
    expect(checkScript({ hook: "I tested this for a week.", body: "The results surprised me.", cta: "Try it yourself." })).toEqual([]);
  });
});
