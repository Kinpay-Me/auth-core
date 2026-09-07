import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createApiClient, type ApiTokenStore } from "./api-client";

const BASE = "https://api.test";

/** A tiny Response stand-in matching the bits the client touches. */
function jsonResponse(status: number, body: unknown) {
  return {
    status,
    ok: status >= 200 && status < 300,
    clone() {
      return jsonResponse(status, body);
    },
    async json() {
      return body;
    },
  } as unknown as Response;
}

const EXPIRED = { success: false, error_code: "TOKEN_EXPIRED", message: "expired" };
const ok = (data: unknown) => ({ success: true, message: "ok", data });

function makeStore(initialAccess: string | null): ApiTokenStore & {
  _access: string | null;
  setTokensSpy: ReturnType<typeof vi.fn>;
} {
  let access = initialAccess;
  const setTokensSpy = vi.fn((newAccess: string, _refresh?: string) => {
    access = newAccess;
  });
  return {
    getAccessToken: () => access,
    getRefreshToken: () => "refresh-1",
    setTokens: setTokensSpy,
    clearSession: vi.fn(),
    setTokensSpy,
    get _access() {
      return access;
    },
    set _access(v: string | null) {
      access = v;
    },
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createApiClient refresh handling", () => {
  it("writes the refreshed token back to the store after a successful refresh", async () => {
    const store = makeStore("access-1");
    let refreshed = false;

    const fetchMock = vi.fn(async (url: string) => {
      if (url.endsWith("/auth/token/refresh")) {
        refreshed = true;
        return jsonResponse(
          200,
          ok({ access_token: "access-2", refresh_token: "refresh-2" }),
        );
      }
      // /data: 401 until a refresh has happened, then 200.
      return refreshed
        ? jsonResponse(200, ok({ ok: true }))
        : jsonResponse(401, EXPIRED);
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = createApiClient({ baseUrl: BASE, store });
    const result = await client.get<{ ok: boolean }>("/data");

    expect(result).toEqual({ ok: true });
    // Write-back: the new access + refresh tokens reached the (shared) store.
    expect(store.setTokensSpy).toHaveBeenCalledWith("access-2", "refresh-2");
  });

  it("single-flights concurrent refreshes into ONE refresh round-trip", async () => {
    const store = makeStore("access-1");
    let refreshed = false;
    let refreshCalls = 0;

    const fetchMock = vi.fn(async (url: string) => {
      if (url.endsWith("/auth/token/refresh")) {
        refreshCalls += 1;
        // Simulate network latency so both callers overlap on the in-flight lock.
        await new Promise((r) => setTimeout(r, 10));
        refreshed = true;
        return jsonResponse(
          200,
          ok({ access_token: "access-2", refresh_token: "refresh-2" }),
        );
      }
      return refreshed
        ? jsonResponse(200, ok({ ok: true }))
        : jsonResponse(401, EXPIRED);
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = createApiClient({ baseUrl: BASE, store });
    const [a, b] = await Promise.all([
      client.get<{ ok: boolean }>("/data"),
      client.get<{ ok: boolean }>("/data"),
    ]);

    expect(a).toEqual({ ok: true });
    expect(b).toEqual({ ok: true });
    // Two concurrent 401s, exactly one underlying refresh.
    expect(refreshCalls).toBe(1);
  });

  it("on 401 re-reads the cookie first and reuses a token another app wrote (no refresh)", async () => {
    // requestToken will be "old"; a sibling app writes "new" before we handle
    // the 401. We must retry with "new" and NOT spend our own refresh.
    const store = makeStore("old");
    let dataCalls = 0;
    let refreshCalls = 0;

    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.endsWith("/auth/token/refresh")) {
        refreshCalls += 1;
        return jsonResponse(
          200,
          ok({ access_token: "should-not-be-used", refresh_token: "x" }),
        );
      }
      dataCalls += 1;
      if (dataCalls === 1) {
        // Simulate another suite app refreshing + writing the shared cookie.
        store._access = "new";
        return jsonResponse(401, EXPIRED);
      }
      // Retry: assert we actually sent the freshly-read token.
      const auth = (init?.headers as Record<string, string>)?.Authorization;
      expect(auth).toBe("Bearer new");
      return jsonResponse(200, ok({ ok: true }));
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = createApiClient({ baseUrl: BASE, store });
    const result = await client.get<{ ok: boolean }>("/data");

    expect(result).toEqual({ ok: true });
    expect(refreshCalls).toBe(0); // recovered via the shared cookie, no refresh
    expect(dataCalls).toBe(2); // original + one retry
  });
});
