import { describe, it, expect } from "vitest";
import { safeRedirect } from "./redirect";

const opts = { allowedHosts: ["kinpay.me"], fallback: "/" };

describe("safeRedirect", () => {
  it("allows same-app relative paths", () => {
    expect(safeRedirect("/manager/dashboard", opts)).toBe("/manager/dashboard");
    expect(safeRedirect("/", opts)).toBe("/");
  });

  it("allows absolute URLs on an allowed registrable domain (subdomains too)", () => {
    expect(safeRedirect("https://circles.kinpay.me/member/circles", opts)).toBe(
      "https://circles.kinpay.me/member/circles",
    );
    expect(safeRedirect("https://kinpay.me/x", opts)).toBe("https://kinpay.me/x");
  });

  it("rejects external hosts, protocol-relative, and junk → fallback", () => {
    expect(safeRedirect("https://evil.com/phish", opts)).toBe("/");
    expect(safeRedirect("//evil.com", opts)).toBe("/");
    expect(safeRedirect("javascript:alert(1)", opts)).toBe("/");
    expect(safeRedirect("https://notkinpay.me.evil.com", opts)).toBe("/");
    expect(safeRedirect(null, opts)).toBe("/");
    expect(safeRedirect("", opts)).toBe("/");
  });

  it("honours a custom fallback", () => {
    expect(safeRedirect("https://evil.com", { allowedHosts: ["kinpay.me"], fallback: "/login" })).toBe("/login");
  });
});
