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

  // A backslash is treated as a slash in the authority position for special
  // schemes (WHATWG URL), so these are protocol-relative URLs in every browser
  // even though they start with a single "/". Guarding only "//" let them
  // through and left an open redirect on every ?redirect= auth surface.
  it("rejects backslash protocol-relative targets", () => {
    expect(safeRedirect("/\\evil.com", opts)).toBe("/");
    expect(safeRedirect("/\\/evil.com", opts)).toBe("/");
    expect(safeRedirect("/\\\\evil.com", opts)).toBe("/");
    expect(safeRedirect("/\\evil.com/path?a=1", opts)).toBe("/");
  });

  // The property that actually matters: whatever comes back must resolve to the
  // app's own origin (or an allowed host), never off-site. Asserting on the
  // return value alone would miss a string the URL parser reinterprets.
  it("never resolves to an off-site origin", () => {
    const base = "https://app.kinpay.me";
    const hostile = [
      "//evil.com",
      "/\\evil.com",
      "/\\/evil.com",
      "/\\\\evil.com",
      "https://evil.com/phish",
      "https://notkinpay.me.evil.com",
      "javascript:alert(1)",
    ];
    for (const raw of hostile) {
      const resolved = new URL(safeRedirect(raw, opts), base);
      expect(resolved.hostname, `"${raw}" escaped the origin`).toBe("app.kinpay.me");
    }
  });

  it("still allows legitimate paths that merely contain a backslash", () => {
    expect(safeRedirect("/docs/a\\b", opts)).toBe("/docs/a\\b");
  });

  it("honours a custom fallback", () => {
    expect(safeRedirect("https://evil.com", { allowedHosts: ["kinpay.me"], fallback: "/login" })).toBe("/login");
  });
});
