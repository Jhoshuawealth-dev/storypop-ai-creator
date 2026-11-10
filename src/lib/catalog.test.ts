import { describe, expect, it } from "vitest";
import { plans, yearlyMonthlyPrice } from "./catalog";

describe("yearly discount", () => {
  it("takes 10% off monthly prices", () => {
    expect(yearlyMonthlyPrice(9)).toBe(8.1);
    expect(yearlyMonthlyPrice(29)).toBe(26.1);
    expect(yearlyMonthlyPrice(59)).toBe(53.1);
    expect(yearlyMonthlyPrice(149)).toBe(134.1);
  });
  it("shows the discounted yearly prices on plans", () => {
    const byId = Object.fromEntries(plans.map((p) => [p.name, p.priceYearly]));
    expect(byId["Starter"]).toBe("$8.10");
    expect(byId["Business"]).toBe("$134.10");
  });
});
