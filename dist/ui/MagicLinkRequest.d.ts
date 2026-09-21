/**
 * Shared Magic-Link request screen. Presentation only — behavior via props.
 * Mirrors the app's passwordless flow: one identifier (email) field + submit,
 * then a "check your inbox" confirmation showing the identifier we sent to.
 *
 * The sent/not-sent UI state is managed locally: `onSubmit` is called with the
 * identifier and, once it resolves, the confirmation is shown. Copy is a single
 * `labels` object with English defaults, so both apps render identical wording
 * out of the box; pass `labels` to translate.
 */
import { type ReactNode } from "react";
import { type LinkLike } from "./primitives";
declare const DEFAULT_LABELS: {
    title: string;
    subtitle: string;
    identifier: string;
    identifierPlaceholder: string;
    submit: string;
    submitting: string;
    /** Confirmation heading once the link is sent. */
    sentTitle: string;
    /** Message wraps the identifier: `{before} <strong>X</strong>. {after}` */
    sentMessageBefore: string;
    sentMessageAfter: string;
    backToLogin: string;
    useDifferent: string;
};
export interface MagicLinkRequestProps {
    /** Called with the entered identifier; resolving shows the sent confirmation. */
    onSubmit: (identifier: string) => void | Promise<void>;
    error?: string | null;
    pending?: boolean;
    brand?: ReactNode;
    theme?: "light" | "dark";
    badges?: string[];
    /** Shown as a link on both the form and the confirmation when provided. */
    backToLoginHref?: string;
    labels?: Partial<typeof DEFAULT_LABELS>;
    LinkComponent?: LinkLike;
}
export declare function MagicLinkRequest({ onSubmit, error, pending, brand, theme, badges, backToLoginHref, labels, LinkComponent, }: MagicLinkRequestProps): import("react").JSX.Element;
export {};
