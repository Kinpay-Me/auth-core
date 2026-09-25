/**
 * Account verification — the suite's shared rule for whether an authenticated
 * account has confirmed a contact channel, and whether it should be sent to a
 * verify flow.
 *
 * This lives in auth-core, not per app, for one concrete reason: the two
 * verification flags travel in the shared SSO cookie, which one app writes and
 * another reads. When each app kept its own copy of "verified === email OR
 * phone", they also kept their own idea of the field *names* — the identity
 * service writes snake_case (`email_verified`), one consumer had mapped it to
 * camelCase (`emailVerified`) — and a hand-off cookie read as `undefined` on
 * both, wrongly bouncing a fully-verified user into the verify flow. A single
 * shared, casing-tolerant predicate makes that class of bug impossible.
 *
 * Pure and headless: no routing, no UI. Each app owns WHERE an unverified
 * account is sent; this only answers WHETHER it is verified.
 */
/**
 * The verification flags as they may appear on a suite user — accepted in
 * either casing so any app can pass its own user model unchanged:
 * `email_verified` (identity-service / cookie wire shape) or `emailVerified`
 * (a consumer's camelCase model). Both optional: an absent flag means
 * "unknown", never "unverified".
 */
export interface VerificationFlags {
    email_verified?: boolean;
    phone_verified?: boolean;
    emailVerified?: boolean;
    phoneVerified?: boolean;
}
/**
 * Whether the account has confirmed at least one contact channel. Mirrors the
 * identity service: verified === email OR phone confirmed. An absent flag is
 * treated as not-yet-confirmed (never fabricated as true).
 */
export declare function isAccountVerified(user: VerificationFlags | null | undefined): boolean;
/**
 * Whether the session actually carries verification info (either flag present
 * in either casing). Lets a gate fail open on a legacy or partial session that
 * carries neither flag rather than treating "no info" as "unverified".
 */
export declare function isVerificationKnown(user: VerificationFlags | null | undefined): boolean;
/**
 * The gate predicate: should this account be sent to the verify flow? True only
 * when the session KNOWS the account and reports it unverified on both
 * channels — so an absent flag never gates (fail open). This is the shared
 * version of the check each app's app-shell runs before handing off to its own
 * verify surface.
 */
export declare function needsVerification(user: VerificationFlags | null | undefined): boolean;
