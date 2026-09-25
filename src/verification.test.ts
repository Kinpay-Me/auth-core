import { describe, it, expect } from "vitest";
import {
  isAccountVerified,
  isVerificationKnown,
  needsVerification,
} from "./verification";

describe("isAccountVerified (email OR phone)", () => {
  it("is true when either channel is confirmed", () => {
    expect(isAccountVerified({ email_verified: true, phone_verified: false })).toBe(true);
    expect(isAccountVerified({ email_verified: false, phone_verified: true })).toBe(true);
    expect(isAccountVerified({ email_verified: true, phone_verified: true })).toBe(true);
  });

  it("is false when both are false, absent, or the user is missing", () => {
    expect(isAccountVerified({ email_verified: false, phone_verified: false })).toBe(false);
    expect(isAccountVerified({})).toBe(false);
    expect(isAccountVerified(null)).toBe(false);
    expect(isAccountVerified(undefined)).toBe(false);
  });

  it("reads camelCase flags too (a consumer's own user model)", () => {
    expect(isAccountVerified({ emailVerified: true })).toBe(true);
    expect(isAccountVerified({ phoneVerified: true })).toBe(true);
    expect(isAccountVerified({ emailVerified: false, phoneVerified: false })).toBe(false);
  });

  it("treats either casing equivalently (the bug this module prevents)", () => {
    // A hand-off cookie carries snake_case; a consumer reading it as a
    // camelCase-only model used to see undefined on both → false. Here both
    // shapes agree.
    expect(isAccountVerified({ email_verified: true })).toBe(
      isAccountVerified({ emailVerified: true }),
    );
  });
});

describe("isVerificationKnown", () => {
  it("is true when any flag is present in either casing", () => {
    expect(isVerificationKnown({ email_verified: false })).toBe(true);
    expect(isVerificationKnown({ phoneVerified: true })).toBe(true);
  });

  it("is false when no flag is present (fail-open signal)", () => {
    expect(isVerificationKnown({})).toBe(false);
    expect(isVerificationKnown(null)).toBe(false);
  });
});

describe("needsVerification (the gate predicate)", () => {
  it("gates only a known-unverified account (both channels false)", () => {
    expect(needsVerification({ email_verified: false, phone_verified: false })).toBe(true);
    expect(needsVerification({ emailVerified: false, phoneVerified: false })).toBe(true);
  });

  it("does not gate a verified account", () => {
    expect(needsVerification({ email_verified: true, phone_verified: false })).toBe(false);
  });

  it("fails open when verification info is absent (legacy/partial session)", () => {
    expect(needsVerification({})).toBe(false);
    expect(needsVerification(null)).toBe(false);
    expect(needsVerification(undefined)).toBe(false);
  });

  it("gates when the only known channel is false", () => {
    expect(needsVerification({ email_verified: false })).toBe(true);
    expect(needsVerification({ phoneVerified: false })).toBe(true);
  });
});
