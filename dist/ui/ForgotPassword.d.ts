/**
 * Shared ForgotPassword screen. Presentation only — the app owns the
 * challenge/reset-token correlation; this component just walks a local step
 * machine ("email" → "otp" → "new-password" → "done") and calls one injected
 * callback per step, advancing only when that callback resolves.
 *
 * Copy is a single `labels` object with English defaults, so both apps render
 * identical wording out of the box; pass `labels` to translate.
 */
import { type ReactNode } from "react";
import { type LinkLike } from "./primitives";
declare const DEFAULT_LABELS: {
    emailTitle: string;
    emailSubtitle: string;
    email: string;
    emailPlaceholder: string;
    requestSubmit: string;
    requesting: string;
    otpTitle: string;
    otpSubtitle: string;
    otp: string;
    verifySubmit: string;
    verifying: string;
    passwordTitle: string;
    passwordSubtitle: string;
    password: string;
    passwordSubmit: string;
    settingPassword: string;
    doneTitle: string;
    doneMessage: string;
    backToLogin: string;
    signIn: string;
    magicLink: string;
};
export interface ForgotPasswordProps {
    onRequestReset: (email: string) => void | Promise<void>;
    onVerifyCode: (otp: string) => void | Promise<void>;
    onSetPassword: (newPassword: string) => void | Promise<void>;
    error?: string | null;
    pending?: boolean;
    brand?: ReactNode;
    theme?: "light" | "dark";
    badges?: string[];
    /** Shown as a "Back to Sign In" link and the success CTA when provided. */
    backToLoginHref?: string;
    /** When set, the email step offers an "email me a sign-in link instead" affordance. */
    magicLinkHref?: string;
    labels?: Partial<typeof DEFAULT_LABELS>;
    LinkComponent?: LinkLike;
}
export declare function ForgotPassword({ onRequestReset, onVerifyCode, onSetPassword, error, pending, brand, theme, badges, backToLoginHref, magicLinkHref, labels, LinkComponent, }: ForgotPasswordProps): import("react").JSX.Element;
export {};
