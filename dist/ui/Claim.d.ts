/**
 * Shared Claim screen. A member whose account was provisioned for them at the
 * desk (a "shell" — no password) proves their identifier via OTP and sets a
 * first password, landing signed in. Presentation only — behavior via props.
 *
 * Two steps are managed as internal state ("identifier" → "verify"). The app
 * owns the challenge id / API correlation; this component only calls the two
 * callbacks: `onRequestCode(identifier)` then `onVerify({ otp, password })`.
 *
 * A WhatsApp gate governs phone OTP delivery in the source route; here it is a
 * `whatsappEnabled` prop that adjusts copy only (phone+email vs email-only).
 *
 * Copy is a single `labels` object with English defaults, so both apps render
 * identical wording out of the box; pass `labels` to translate.
 */
import { type ReactNode } from "react";
import { type LinkLike } from "./primitives";
export interface ClaimValues {
    otp: string;
    password: string;
}
declare const DEFAULT_LABELS: {
    title: string;
    /** Step 1 subtitle when phone claims are available (WhatsApp on). */
    subtitleIdentifier: string;
    /** Step 1 subtitle when only email claims can be delivered (WhatsApp off). */
    subtitleIdentifierEmailOnly: string;
    /** Step 2 subtitle; `{identifier}` is replaced with the value being claimed. */
    subtitleVerify: string;
    identifierPhoneOrEmail: string;
    identifierEmail: string;
    identifierPhoneOrEmailPlaceholder: string;
    identifierEmailPlaceholder: string;
    sendCode: string;
    sending: string;
    otp: string;
    password: string;
    submit: string;
    submitting: string;
    changeIdentifier: string;
    changeIdentifierEmailOnly: string;
    haveAccount: string;
    signIn: string;
};
export interface ClaimProps {
    /** Step 1: request a code for the entered identifier. Resolve to advance. */
    onRequestCode: (identifier: string) => void | Promise<void>;
    /** Step 2: verify the code and set the first password. */
    onVerify: (values: ClaimValues) => void | Promise<void>;
    error?: string | null;
    pending?: boolean;
    /** When on, phone claims are available and the copy invites phone-or-email. */
    whatsappEnabled?: boolean;
    brand?: ReactNode;
    theme?: "light" | "dark";
    badges?: string[];
    /** Shown only if provided: a way out to the normal sign-in screen. */
    backToLoginHref?: string;
    labels?: Partial<typeof DEFAULT_LABELS>;
    LinkComponent?: LinkLike;
}
export declare function Claim({ onRequestCode, onVerify, error, pending, whatsappEnabled, brand, theme, badges, backToLoginHref, labels, LinkComponent, }: ClaimProps): import("react").JSX.Element;
export {};
