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
    post<T>(endpoint: string, body?: Record<string, unknown>, options?: RequestOptions): Promise<T>;
    put<T>(endpoint: string, body?: Record<string, unknown>, options?: RequestOptions): Promise<T>;
    patch<T>(endpoint: string, body?: Record<string, unknown>, options?: RequestOptions): Promise<T>;
    delete<T>(endpoint: string, options?: RequestOptions): Promise<T>;
}
export declare function createApiClient(opts: ApiClientOptions): ApiClient;
