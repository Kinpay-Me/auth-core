/**
 * Cookie-based session store (SSR-compatible): the session lives in a
 * JS-readable cookie so the server can read auth state during SSR and render
 * the correct HTML. Extracted verbatim from the main app, with the cookie name
 * and lifetimes made configurable so every app (and tenant) can supply its own.
 */
import type { AuthSession, SessionStore } from "./types";

function parseCookies(cookieString: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  cookieString.split(";").forEach((pair) => {
    const [key, ...rest] = pair.split("=");
    if (key) cookies[key.trim()] = decodeURIComponent(rest.join("="));
  });
  return cookies;
}

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
export function createCookieSessionStore<TUser>(
  options: CookieSessionStoreOptions,
): SessionStore<TUser> {
  const COOKIE_NAME = options.cookieName;
  const COOKIE_DOMAIN = options.cookieDomain;
  const SECURE = options.secure ?? false;
  const MAX_AGE = options.maxAgeSeconds ?? 30 * 24 * 60 * 60;
  const REDIRECT_COOKIE = options.redirectCookieName ?? "kinpay_redirect";
  const REDIRECT_MAX_AGE = options.redirectMaxAgeSeconds ?? 10 * 60;

  /** Shared attribute tail for the session cookie: adds `Domain`/`Secure` only
   * when configured, so host-only (localhost) writes keep working unchanged. */
  function sessionCookieAttrs(maxAge: number): string {
    let attrs = `; path=/; max-age=${maxAge}; SameSite=Lax`;
    if (COOKIE_DOMAIN) attrs += `; Domain=${COOKIE_DOMAIN}`;
    if (SECURE) attrs += `; Secure`;
    return attrs;
  }

  function getStoredSession(cookieHeader?: string): AuthSession<TUser> | null {
    try {
      const raw =
        typeof document !== "undefined"
          ? parseCookies(document.cookie)[COOKIE_NAME]
          : cookieHeader
            ? parseCookies(cookieHeader)[COOKIE_NAME]
            : null;
      if (!raw) return null;
      return JSON.parse(raw) as AuthSession<TUser>;
    } catch {
      return null;
    }
  }

  function getAccessToken(cookieHeader?: string): string | null {
    return getStoredSession(cookieHeader)?.access_token ?? null;
  }

  function getRefreshToken(cookieHeader?: string): string | null {
    return getStoredSession(cookieHeader)?.refresh_token ?? null;
  }

  function storeSession(session: AuthSession<TUser>): void {
    if (typeof document === "undefined") return;
    const value = encodeURIComponent(JSON.stringify(session));
    document.cookie = `${COOKIE_NAME}=${value}${sessionCookieAttrs(MAX_AGE)}`;
  }

  function setTokens(accessToken: string, refreshToken?: string): void {
    const session = getStoredSession();
    if (session) {
      storeSession({
        ...session,
        access_token: accessToken,
        ...(refreshToken ? { refresh_token: refreshToken } : {}),
      });
    }
  }

  function clearSession(): void {
    if (typeof document === "undefined") return;
    // The Domain must match the write for the browser to actually drop a
    // domain-scoped cookie, so logout clears the shared session everywhere.
    const domainAttr = COOKIE_DOMAIN ? `; Domain=${COOKIE_DOMAIN}` : "";
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0${domainAttr}`;
  }

  function serializeSessionCookie(session: AuthSession<TUser>): string {
    const value = encodeURIComponent(JSON.stringify(session));
    return `${COOKIE_NAME}=${value}${sessionCookieAttrs(MAX_AGE)}`;
  }

  function setRedirectCookie(path: string): void {
    if (typeof document === "undefined") return;
    document.cookie = `${REDIRECT_COOKIE}=${encodeURIComponent(path)}; path=/; max-age=${REDIRECT_MAX_AGE}; SameSite=Lax`;
  }

  function serializeRedirectCookie(path: string): string {
    return `${REDIRECT_COOKIE}=${encodeURIComponent(path)}; path=/; max-age=${REDIRECT_MAX_AGE}; SameSite=Lax`;
  }

  function getAndClearRedirectCookie(): string | null {
    if (typeof document === "undefined") return null;
    const value = parseCookies(document.cookie)[REDIRECT_COOKIE];
    if (!value) return null;
    document.cookie = `${REDIRECT_COOKIE}=; path=/; max-age=0`;
    return decodeURIComponent(value);
  }

  return {
    getStoredSession,
    getAccessToken,
    getRefreshToken,
    storeSession,
    setTokens,
    clearSession,
    serializeSessionCookie,
    setRedirectCookie,
    serializeRedirectCookie,
    getAndClearRedirectCookie,
  };
}
