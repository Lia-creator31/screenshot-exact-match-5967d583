import { describe, expect, it } from "vitest";
import { wedding, countdown, ticketData, validateWish, mapUrl } from "@/lib/wedding-config";
describe("Wedding invitation rules", () => {
  it("holds akad on 18 December 2026", () => expect(wedding.akad.date.slice(0, 10)).toBe("2026-12-18"));
  it("holds reception on 20 December 2026", () => expect(wedding.reception.date.slice(0, 10)).toBe("2026-12-20"));
  it("gives each guest a distinct QR payload", () => {
    expect(ticketData("guest-1", "Pondra", "VIP")).not.toBe(ticketData("guest-2", "Pondra", "VIP"));
    expect(JSON.parse(ticketData("guest-1", "Pondra", "VIP")).guestId).toBe("guest-1");
  });
  it("validates wishes before submission", () => { expect(validateWish("", "hi")).toBe(false); expect(validateWish("Dina", "Selamat menikah!")).toBe(true); });
  it("never counts below zero", () => expect(countdown(wedding.akad.date, Date.parse("2027-01-01"))).toEqual([0, 0, 0, 0]));
  it("maps configured coordinates without inventing a destination", () => { expect(mapUrl(null)).toBeNull(); expect(mapUrl([-7.1, 112.6])).toBe("https://www.google.com/maps/search/?api=1&query=-7.1,112.6"); });
});