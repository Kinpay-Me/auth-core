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
export declare function safeRedirect(raw: string | null | undefined, opts?: SafeRedirectOptions): string;
