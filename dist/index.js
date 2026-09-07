// src/types.ts
var ApiError = class extends Error {
  constructor(status, errorCode, message) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
    this.name = "ApiError";
  }
};

// src/session-store.ts
function parseCookies(cookieString) {
  const cookies = {};
  cookieString.split(";").forEach((pair) => {
    const [key, ...rest] = pair.split("=");
    if (key) cookies[key.trim()] = decodeURIComponent(rest.join("="));
  });
  return cookies;
}
function createCookieSessionStore(options) {
  const COOKIE_NAME = options.cookieName;
  const COOKIE_DOMAIN = options.cookieDomain;
  const SECURE = options.secure ?? false;
  const MAX_AGE = options.maxAgeSeconds ?? 30 * 24 * 60 * 60;
  const REDIRECT_COOKIE = options.redirectCookieName ?? "kinpay_redirect";
  const REDIRECT_MAX_AGE = options.redirectMaxAgeSeconds ?? 10 * 60;
  function sessionCookieAttrs(maxAge) {
    let attrs = `; path=/; max-age=${maxAge}; SameSite=Lax`;
    if (COOKIE_DOMAIN) attrs += `; Domain=${COOKIE_DOMAIN}`;
    if (SECURE) attrs += `; Secure`;
    return attrs;
  }
  function getStoredSession(cookieHeader) {
    try {
      const raw = typeof document !== "undefined" ? parseCookies(document.cookie)[COOKIE_NAME] : cookieHeader ? parseCookies(cookieHeader)[COOKIE_NAME] : null;
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  function getAccessToken(cookieHeader) {
    return getStoredSession(cookieHeader)?.access_token ?? null;
  }
  function getRefreshToken(cookieHeader) {
    return getStoredSession(cookieHeader)?.refresh_token ?? null;
  }
  function storeSession(session) {
    if (typeof document === "undefined") return;
    const value = encodeURIComponent(JSON.stringify(session));
    document.cookie = `${COOKIE_NAME}=${value}${sessionCookieAttrs(MAX_AGE)}`;
  }
  function setTokens(accessToken, refreshToken) {
    const session = getStoredSession();
    if (session) {
      storeSession({
        ...session,
        access_token: accessToken,
        ...refreshToken ? { refresh_token: refreshToken } : {}
      });
    }
  }
  function clearSession() {
    if (typeof document === "undefined") return;
    const domainAttr = COOKIE_DOMAIN ? `; Domain=${COOKIE_DOMAIN}` : "";
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0${domainAttr}`;
  }
  function serializeSessionCookie(session) {
    const value = encodeURIComponent(JSON.stringify(session));
    return `${COOKIE_NAME}=${value}${sessionCookieAttrs(MAX_AGE)}`;
  }
  function setRedirectCookie(path) {
    if (typeof document === "undefined") return;
    document.cookie = `${REDIRECT_COOKIE}=${encodeURIComponent(path)}; path=/; max-age=${REDIRECT_MAX_AGE}; SameSite=Lax`;
  }
  function serializeRedirectCookie(path) {
    return `${REDIRECT_COOKIE}=${encodeURIComponent(path)}; path=/; max-age=${REDIRECT_MAX_AGE}; SameSite=Lax`;
  }
  function getAndClearRedirectCookie() {
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
    getAndClearRedirectCookie
  };
}

// src/api-client.ts
function createApiClient(opts) {
  const { baseUrl, store, resolveBase, onSessionExpired, onAccountSuspended } = opts;
  function fail() {
    store.clearSession();
    onSessionExpired?.();
    return false;
  }
  let isRefreshing = false;
  let refreshPromise = null;
  async function refreshToken() {
    try {
      const currentRefreshToken = store.getRefreshToken();
      if (!currentRefreshToken) return fail();
      const response = await fetch(`${baseUrl}/auth/token/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ refresh_token: currentRefreshToken })
      });
      if (!response.ok) return fail();
      const json = await response.json();
      if (json.success && json.data.access_token) {
        store.setTokens(json.data.access_token, json.data.refresh_token);
        return true;
      }
      return fail();
    } catch {
      return fail();
    }
  }
  async function api(endpoint, options = {}) {
    const {
      body,
      public: isPublic,
      headers: customHeaders,
      ...fetchOptions
    } = options;
    const headers = {
      "Content-Type": "application/json",
      ...customHeaders ?? {}
    };
    let requestToken = null;
    if (!isPublic) {
      requestToken = store.getAccessToken();
      if (requestToken) headers["Authorization"] = `Bearer ${requestToken}`;
    }
    const base = resolveBase?.(endpoint) ?? baseUrl;
    const doFetch = () => fetch(`${base}${endpoint}`, {
      ...fetchOptions,
      headers: {
        ...headers,
        ...!isPublic ? { Authorization: `Bearer ${store.getAccessToken() ?? ""}` } : {}
      },
      credentials: "include",
      body: body ? JSON.stringify(body) : void 0
    });
    let response = await doFetch();
    if (response.status === 401 && !isPublic) {
      const errorJson = await response.clone().json().catch(() => null);
      if (errorJson?.error_code === "TOKEN_EXPIRED") {
        const latestToken = store.getAccessToken();
        if (latestToken && latestToken !== requestToken) {
          response = await doFetch();
        } else {
          if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = refreshToken().finally(() => {
              isRefreshing = false;
              refreshPromise = null;
            });
          }
          const refreshed = await (refreshPromise ?? Promise.resolve(false));
          if (refreshed) response = await doFetch();
        }
      }
    }
    if (response.status === 204) return void 0;
    const json = await response.json();
    if (!json.success) {
      if (json.error_code === "ACCOUNT_SUSPENDED") {
        store.clearSession();
        onAccountSuspended?.();
      }
      throw new ApiError(response.status, json.error_code ?? "UNKNOWN", json.message);
    }
    return json.data;
  }
  const client = api;
  client.get = (endpoint, options) => api(endpoint, { ...options, method: "GET" });
  client.post = (endpoint, body, options) => api(endpoint, { ...options, method: "POST", body });
  client.put = (endpoint, body, options) => api(endpoint, { ...options, method: "PUT", body });
  client.patch = (endpoint, body, options) => api(endpoint, { ...options, method: "PATCH", body });
  client.delete = (endpoint, options) => api(endpoint, { ...options, method: "DELETE" });
  return client;
}
export {
  ApiError,
  createApiClient,
  createCookieSessionStore
};
