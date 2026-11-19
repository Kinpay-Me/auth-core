/**
 * Redirect-target validation for the auth surfaces. An auth screen that honours
 * a `?redirect=` param is an open-redirect unless the target is checked — a bare
 * external URL would let a phisher bounce a freshly-authenticated user off-site.
 *
 * The suite's rule: allow same-app relative paths, plus absolute URLs whose host
 * is (a subdomain of) an allowed registrable domain — so cross-app SSO can send
 * a user back to e.g. https://circles.kinpay.me/... but nowhere else.
 */
export interface SafeRedirectOptions {
  /** Registrable domains to trust for absolute URLs, e.g. ["kinpay.me"].
   * A host matches if it equals one, or is a subdomain (endsWith ".<domain>"). */
  allowedHosts?: string[];
  /** Where to send anything that fails validation. Default "/". */
  fallback?: string;
}

export function safeRedirect(
  raw: string | null | undefined,
  opts: SafeRedirectOptions = {},
): string {
  const fallback = opts.fallback ?? "/";
  if (!raw) return fallback;

  // Relative path — allowed only if it resolves to this app's own origin. The
  // URL parser reads more than "//" as an authority: a backslash counts as a
  // slash for special schemes ("/\evil.com"), and tabs and newlines are
  // stripped before parsing ("/\t/evil.com" → "//evil.com"). So rather than
  // listing the tricks, resolve the path against a placeholder origin and
  // reject anything that lands somewhere else.
  if (raw.startsWith("/")) {
    const origin = "https://same-app.invalid";
    try {
      return new URL(raw, origin).origin === origin ? raw : fallback;
    } catch {
      return fallback;
    }
  }

  // Absolute URL — only http(s) to an allowed host.
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return fallback;
    const host = url.hostname.toLowerCase();
    const allowed = (opts.allowedHosts ?? []).some(
      (h) => host === h.toLowerCase() || host.endsWith(`.${h.toLowerCase()}`),
    );
    return allowed ? raw : fallback;
  } catch {
    return fallback;
  }
}
