/**
 * Cookie-based session store (SSR-compatible): the session lives in a
 * JS-readable cookie so the server can read auth state during SSR and render
 * the correct HTML. Extracted verbatim from the main app, with the cookie name
 * and lifetimes made configurable so every app (and tenant) can supply its own.
 */
import type { SessionStore } from "./types";
export interface CookieSessionStoreOptions {
    /** The session cookie name (e.g. "kinpay_session", "kinpay_circles_session"). */
    cookieName: string;
    /**
     * Cookie `Domain` attribute. Set to a shared parent (e.g. ".kinpay.me") so the
     * session cookie is delivered to every sibling subdomain in the suite and the
     * apps share one login. Leave unset for host-only cookies (localhost/dev).
     */
    cookieDomain?: string;
    /**
     * When true, the cookie is written with the `Secure` attribute so the browser
     * only sends it over HTTPS. Required for cross-subdomain production; leave
     * false on localhost (http) or the browser will silently drop the cookie.
     */
    secure?: boolean;
    /** Session lifetime in seconds. Default 30 days. */
    maxAgeSeconds?: number;
    /** Short-lived post-auth redirect cookie name. Default "kinpay_redirect". */
    redirectCookieName?: string;
    /** Redirect cookie lifetime in seconds. Default 10 minutes. */
    redirectMaxAgeSeconds?: number;
}
/** Build a cookie-backed {@link SessionStore}. Methods are standalone closures
 * (no `this`), so an app can destructure them into named exports. */
export declare function createCookieSessionStore<TUser>(options: CookieSessionStoreOptions): SessionStore<TUser>;
