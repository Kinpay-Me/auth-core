import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createCookieSessionStore } from "./session-store";
import type { AuthSession } from "./types";

/**
 * A minimal stand-in for `document.cookie` that works in the node test env.
 * It records every raw write string (so we can assert on attributes like
 * `Domain=` / `Secure` that a real browser strips from the read-back value)
 * and maintains a name→value jar for read semantics.
 */
function installFakeDocument() {
  const jar = new Map<string, string>();
  const writes: string[] = [];
  const doc = {
    get cookie(): string {
      return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
    },
    set cookie(str: string) {
      writes.push(str);
      const [pair] = str.split(";");
      const eq = pair.indexOf("=");
      const name = pair.slice(0, eq).trim();
      const value = pair.slice(eq + 1);
      if (/max-age=0/i.test(str) || value === "") jar.delete(name);
      else jar.set(name, value);
    },
  };
  (globalThis as { document?: unknown }).document = doc;
  return { writes, jar };
}

function uninstallFakeDocument() {
  delete (globalThis as { document?: unknown }).document;
}

interface TestUser {
  id: string;
}

const session: AuthSession<TestUser> = {
  user: { id: "u1" },
  access_token: "access-1",
  refresh_token: "refresh-1",
};

describe("createCookieSessionStore", () => {
  let writes: string[];

  beforeEach(() => {
    ({ writes } = installFakeDocument());
  });

  afterEach(() => {
    uninstallFakeDocument();
  });

  it("writes and reads back under the configured (env-named) cookie name", () => {
    const store = createCookieSessionStore<TestUser>({
      cookieName: "kinpay_sso_staging",
    });
    store.storeSession(session);

    // The raw write uses the configured name.
    expect(writes[0].startsWith("kinpay_sso_staging=")).toBe(true);
    // And it reads back the same session.
    expect(store.getStoredSession()).toEqual(session);
    expect(store.getAccessToken()).toBe("access-1");
    expect(store.getRefreshToken()).toBe("refresh-1");
  });

  it("does not include Domain or Secure when unset (host-only, localhost)", () => {
    const store = createCookieSessionStore<TestUser>({ cookieName: "kinpay_sso" });
    store.storeSession(session);

    expect(writes[0]).not.toMatch(/Domain=/);
    expect(writes[0]).not.toMatch(/Secure/);
    // Sanity: the baseline attributes are still there.
    expect(writes[0]).toMatch(/path=\//);
    expect(writes[0]).toMatch(/SameSite=Lax/);
  });

  it("adds Domain and Secure attributes when configured", () => {
    const store = createCookieSessionStore<TestUser>({
      cookieName: "kinpay_sso",
      cookieDomain: ".kinpay.me",
      secure: true,
    });
    store.storeSession(session);

    expect(writes[0]).toMatch(/Domain=\.kinpay\.me/);
    expect(writes[0]).toMatch(/;\s*Secure/);
  });

  it("emits Domain/Secure in the serialized (SSR header) cookie too", () => {
    const store = createCookieSessionStore<TestUser>({
      cookieName: "kinpay_sso",
      cookieDomain: ".kinpay.me",
      secure: true,
    });
    const serialized = store.serializeSessionCookie(session);

    expect(serialized.startsWith("kinpay_sso=")).toBe(true);
    expect(serialized).toMatch(/Domain=\.kinpay\.me/);
    expect(serialized).toMatch(/;\s*Secure/);
  });

  it("clears with a matching Domain so the shared cookie is actually dropped", () => {
    const store = createCookieSessionStore<TestUser>({
      cookieName: "kinpay_sso",
      cookieDomain: ".kinpay.me",
      secure: true,
    });
    store.storeSession(session);
    store.clearSession();

    const clearWrite = writes[writes.length - 1];
    expect(clearWrite).toMatch(/max-age=0/);
    expect(clearWrite).toMatch(/Domain=\.kinpay\.me/);
    expect(store.getStoredSession()).toBeNull();
  });

  it("setTokens writes the new access token back to the shared cookie", () => {
    const store = createCookieSessionStore<TestUser>({
      cookieName: "kinpay_sso",
      cookieDomain: ".kinpay.me",
      secure: true,
    });
    store.storeSession(session);
    store.setTokens("access-2", "refresh-2");

    expect(store.getAccessToken()).toBe("access-2");
    expect(store.getRefreshToken()).toBe("refresh-2");
    // The write-back carries the shared-cookie attributes too.
    expect(writes[writes.length - 1]).toMatch(/Domain=\.kinpay\.me/);
    expect(writes[writes.length - 1]).toMatch(/;\s*Secure/);
  });
});
