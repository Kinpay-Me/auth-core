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
import { type LinkLike } from "./primitives";
declare const DEFAULT_LABELS: {
    loadingTitle: string;
    loadingMessage: string;
    successTitle: string;
    successMessage: string;
    continue: string;
    errorTitle: string;
    errorMessage: string;
    retry: string;
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
export declare function MagicLinkCallback({ status, errorMessage, continueHref, retryHref, brand, theme, labels, LinkComponent, }: MagicLinkCallbackProps): import("react").JSX.Element;
export {};
