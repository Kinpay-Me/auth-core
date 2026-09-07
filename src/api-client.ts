/**
 * The shared API client: universal-envelope unwrapping, bearer-token auth, and
 * single-flight refresh on TOKEN_EXPIRED. Extracted from the main app; the
 * app-specific side-effects (alert UI, hard redirects) and any secondary-base
 * routing are injected as config, so the client itself is UI- and app-agnostic.
 */
import { ApiError, type ApiResponse } from "./types";

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: Record<string, unknown>;
  /** Skip the Authorization header (e.g. login/register). */
  public?: boolean;
}

/** The token surface the client needs — satisfied by a SessionStore. */
export interface ApiTokenStore {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  setTokens(accessToken: string, refreshToken?: string): void;
  clearSession(): void;
}

export interface ApiClientOptions {
  /** Primary base URL (the identity/API service) — also used for token refresh. */
  baseUrl: string;
  store: ApiTokenStore;
  /** Optional per-endpoint base override (e.g. route /circles/* to another
   * service). Return undefined to use `baseUrl`. */
  resolveBase?(endpoint: string): string | undefined;
  /** Session is unrecoverable (refresh failed / no refresh token). The app
   * clears its own UI state, shows a notice, and redirects. Session is already
   * cleared by the client before this fires. */
  onSessionExpired?(): void;
  /** Server returned ACCOUNT_SUSPENDED. Session is already cleared. */
  onAccountSuspended?(): void;
}

export interface ApiClient {
  <T>(endpoint: string, options?: RequestOptions): Promise<T>;
  get<T>(endpoint: string, options?: RequestOptions): Promise<T>;
  post<T>(
    endpoint: string,
    body?: Record<string, unknown>,
    options?: RequestOptions,
  ): Promise<T>;
  put<T>(
    endpoint: string,
    body?: Record<string, unknown>,
    options?: RequestOptions,
  ): Promise<T>;
  patch<T>(
    endpoint: string,
    body?: Record<string, unknown>,
    options?: RequestOptions,
  ): Promise<T>;
  delete<T>(endpoint: string, options?: RequestOptions): Promise<T>;
}

export function createApiClient(opts: ApiClientOptions): ApiClient {
  const { baseUrl, store, resolveBase, onSessionExpired, onAccountSuspended } =
    opts;

  function fail(): false {
    store.clearSession();
    onSessionExpired?.();
    return false;
  }

  // Single-flight refresh lock — concurrent 401s share one refresh round-trip.
  let isRefreshing = false;
  let refreshPromise: Promise<boolean> | null = null;

  async function refreshToken(): Promise<boolean> {
    try {
      const currentRefreshToken = store.getRefreshToken();
      if (!currentRefreshToken) return fail();

      const response = await fetch(`${baseUrl}/auth/token/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ refresh_token: currentRefreshToken }),
      });
      if (!response.ok) return fail();
      const json: ApiResponse<{
        access_token: string;
        refresh_token: string;
      }> = await response.json();
      if (json.success && json.data.access_token) {
        store.setTokens(json.data.access_token, json.data.refresh_token);
        return true;
      }
      return fail();
    } catch {
      return fail();
    }
  }

  async function api<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const {
      body,
      public: isPublic,
      headers: customHeaders,
      ...fetchOptions
    } = options;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((customHeaders as Record<string, string>) ?? {}),
    };

    // The access token this request was made with — captured so the 401 handler
    // can tell "our token expired" from "another app already rotated the token".
    let requestToken: string | null = null;
    if (!isPublic) {
      requestToken = store.getAccessToken();
      if (requestToken) headers["Authorization"] = `Bearer ${requestToken}`;
    }

    const base = resolveBase?.(endpoint) ?? baseUrl;

    const doFetch = () =>
      fetch(`${base}${endpoint}`, {
        ...fetchOptions,
        headers: {
          ...headers,
          ...(!isPublic
            ? { Authorization: `Bearer ${store.getAccessToken() ?? ""}` }
            : {}),
        },
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
      });

    let response = await doFetch();

    // Auto-refresh on TOKEN_EXPIRED, then retry once.
    if (response.status === 401 && !isPublic) {
      const errorJson = await response
        .clone()
        .json()
        .catch(() => null);
      if (errorJson?.error_code === "TOKEN_EXPIRED") {
        // D2: re-read the shared cookie FIRST. In the suite another app (a
        // sibling subdomain sharing the kinpay_sso cookie) may have already
        // refreshed and written back a newer token. If the stored token now
        // differs from the one this request used, just retry with it — no need
        // to spend our own refresh round-trip (and risk rotating it out again).
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

    if (response.status === 204) return undefined as T;

    const json: ApiResponse<T> = await response.json();

    if (!json.success) {
      if (json.error_code === "ACCOUNT_SUSPENDED") {
        store.clearSession();
        onAccountSuspended?.();
      }
      throw new ApiError(response.status, json.error_code ?? "UNKNOWN", json.message);
    }

    return json.data;
  }

  const client = api as ApiClient;
  client.get = <T>(endpoint: string, options?: RequestOptions) =>
    api<T>(endpoint, { ...options, method: "GET" });
  client.post = <T>(
    endpoint: string,
    body?: Record<string, unknown>,
    options?: RequestOptions,
  ) => api<T>(endpoint, { ...options, method: "POST", body });
  client.put = <T>(
    endpoint: string,
    body?: Record<string, unknown>,
    options?: RequestOptions,
  ) => api<T>(endpoint, { ...options, method: "PUT", body });
  client.patch = <T>(
    endpoint: string,
    body?: Record<string, unknown>,
    options?: RequestOptions,
  ) => api<T>(endpoint, { ...options, method: "PATCH", body });
  client.delete = <T>(endpoint: string, options?: RequestOptions) =>
    api<T>(endpoint, { ...options, method: "DELETE" });

  return client;
}
