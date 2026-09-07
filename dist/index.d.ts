/**
 * @kinpay-me/auth-core — configurable, headless auth for the KinPay app suite.
 *
 * Each app wires these to its own config (cookie name, base URLs, side-effect
 * hooks) and keeps its own UI/screens. No React UI is shipped here.
 */
export { ApiError, type ApiResponse, type AuthSession, type PreviousSession, type SessionStore, } from "./types";
export { createCookieSessionStore, type CookieSessionStoreOptions, } from "./session-store";
export { createApiClient, type ApiClient, type ApiClientOptions, type ApiTokenStore, type RequestOptions, } from "./api-client";
export { safeRedirect, type SafeRedirectOptions } from "./redirect";
