/**
 * Shared auth types. The `User` shape is app-specific (each app maps the
 * identity service's user to its own model), so the session/store/client are
 * generic over `TUser`.
 */

/** The universal response envelope from the KinPay identity/API services. */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error_code?: string;
}

/** Thrown on a non-success envelope. Carries the HTTP status + server code. */
export class ApiError extends Error {
  constructor(
    public status: number,
    public errorCode: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface PreviousSession<TUser> {
  user: TUser;
  access_token: string;
  refresh_token: string;
}

/** The stored session blob — user snapshot + tokens (+ impersonation trail). */
export interface AuthSession<TUser> {
  user: TUser;
  access_token: string;
  refresh_token: string;
  impersonated?: boolean;
  previous_session?: PreviousSession<TUser> | null;
}

/** The session persistence surface the API client depends on. A cookie-backed
 * web implementation is provided; native apps supply their own (SecureStore). */
export interface SessionStore<TUser> {
  getStoredSession(cookieHeader?: string): AuthSession<TUser> | null;
  getAccessToken(cookieHeader?: string): string | null;
  getRefreshToken(cookieHeader?: string): string | null;
  storeSession(session: AuthSession<TUser>): void;
  setTokens(accessToken: string, refreshToken?: string): void;
  clearSession(): void;
  serializeSessionCookie(session: AuthSession<TUser>): string;
  setRedirectCookie(path: string): void;
  serializeRedirectCookie(path: string): string;
  getAndClearRedirectCookie(): string | null;
}
