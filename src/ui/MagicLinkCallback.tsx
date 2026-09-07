/**
 * Shared magic-link callback / verifying screen. Presentation only — NO form.
 * The app route does the actual token redemption and passes the result down as
 * `status`; this component just renders the three states via <StatusScreen>:
 *   - "loading"  → verifying spinner ("Signing you in…")
 *   - "success"  → confirmation + optional "Continue" link
 *   - "error"    → expired/used notice + optional "Back to sign in" link
 *
 * Copy is a single `labels` object with English defaults, so both apps render
 * identical wording out of the box; pass `labels` to translate.
 */
import { type ReactNode } from "react";
import { AuthCard, StatusScreen, AuthLink, type LinkLike } from "./primitives";

const DEFAULT_LABELS = {
  loadingTitle: "Signing you in…",
  loadingMessage: "Just a moment",
  successTitle: "You're signed in",
  successMessage: "Your sign-in link has been verified.",
  continue: "Continue",
  errorTitle: "Link expired or already used",
  errorMessage: "Something went wrong. Please request a new link.",
  retry: "Back to sign in",
};

export interface MagicLinkCallbackProps {
  status: "loading" | "success" | "error";
  /** Overrides the default error copy when provided (e.g. the API message). */
  errorMessage?: string;

  /** "Continue" action link shown on success. Rendered only when provided. */
  continueHref?: string;
  /** "Back to sign in" action link shown on error. Rendered only when provided. */
  retryHref?: string;

  brand?: ReactNode;
  theme?: "light" | "dark";
  labels?: Partial<typeof DEFAULT_LABELS>;
  LinkComponent?: LinkLike;
}

export function MagicLinkCallback({
  status,
  errorMessage,
  continueHref,
  retryHref,
  brand,
  theme,
  labels,
  LinkComponent,
}: MagicLinkCallbackProps) {
  const t = { ...DEFAULT_LABELS, ...labels };

  return (
    <AuthCard brand={brand} theme={theme}>
      {status === "loading" && (
        <StatusScreen
          variant="loading"
          title={t.loadingTitle}
          message={t.loadingMessage}
        />
      )}

      {status === "success" && (
        <StatusScreen
          variant="success"
          title={t.successTitle}
          message={t.successMessage}
          action={continueHref ? (
            <div className="kpa-alts">
              <AuthLink
                href={continueHref}
                className="kpa-btn kpa-btn-secondary"
                LinkComponent={LinkComponent}
              >
                {t.continue}
              </AuthLink>
            </div>
          ) : undefined}
        />
      )}

      {status === "error" && (
        <StatusScreen
          variant="error"
          title={t.errorTitle}
          message={errorMessage ?? t.errorMessage}
          action={retryHref ? (
            <div className="kpa-alts">
              <AuthLink
                href={retryHref}
                className="kpa-btn kpa-btn-secondary"
                LinkComponent={LinkComponent}
              >
                {t.retry}
              </AuthLink>
            </div>
          ) : undefined}
        />
      )}
    </AuthCard>
  );
}
