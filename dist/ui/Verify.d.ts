/**
 * Shared Verify screen: prove the email or phone number on an account with a
 * six-digit code. Presentation only — the app owns the calls (KinPay's
 * /auth/verify/{email,phone}/{request,confirm}) and the challenge id; this
 * component walks "send" → "code" → "done" per contact and calls one injected
 * callback per step, advancing only when it resolves.
 *
 * An account can have an email, a phone number, or both: `contacts` lists the
 * ones it can verify, and the screen offers to switch to the other one. Codes
 * are texted (SMS) to a phone and emailed to an email.
 *
 * Copy is a single `labels` object with English defaults, so both apps render
 * identical wording out of the box; pass `labels` to translate.
 */
import { type ReactNode } from "react";
import { type LinkLike } from "./primitives";
export type VerifyChannel = "email" | "phone";
export interface VerifyContact {
    channel: VerifyChannel;
    /** What the code goes to, as the reader should see it: the email, or the number (masked or not). */
    contact: string;
}
declare const DEFAULT_LABELS: {
    emailTitle: string;
    phoneTitle: string;
    emailIntro: string;
    phoneIntro: string;
    sendCode: string;
    sending: string;
    emailSent: string;
    phoneSent: string;
    otp: string;
    verify: string;
    verifying: string;
    resendIn: string;
    resend: string;
    useEmail: string;
    usePhone: string;
    doneEmail: string;
    donePhone: string;
    doneMessage: string;
    continue: string;
    signOut: string;
};
export interface VerifyProps {
    /** The contacts the account can verify; the first is offered first. */
    contacts: VerifyContact[];
    /** Ask for a code. Resolve with the seconds before another may be sent (default 60). */
    onSendCode: (channel: VerifyChannel) => Promise<{
        resendInSeconds?: number;
    } | void>;
    /** Check the code; resolve when it is right, throw (and set `error`) when not. */
    onConfirm: (channel: VerifyChannel, code: string) => void | Promise<void>;
    /** After a contact is verified: the "Continue" button. Without it, no done screen: onConfirm is the end. */
    onContinue?: () => void;
    /** Send the first contact's code as soon as the screen opens (e.g. right after sign-up), skipping "Send the code". */
    autoSend?: boolean;
    error?: string | null;
    pending?: boolean;
    /** Called when the reader switches contact or a step changes, so the app can clear its error. */
    onStepChange?: () => void;
    brand?: ReactNode;
    theme?: "light" | "dark";
    badges?: string[];
    /** A way out for someone who cannot get the code: a "Sign out" link. */
    signOutHref?: string;
    /** Shown under the form (e.g. a development build's code). */
    footer?: ReactNode;
    labels?: Partial<typeof DEFAULT_LABELS>;
    LinkComponent?: LinkLike;
}
export declare function Verify({ contacts, onSendCode, onConfirm, onContinue, autoSend, error, pending, onStepChange, brand, theme, badges, signOutHref, footer, labels, LinkComponent, }: VerifyProps): import("react").JSX.Element | null;
export {};
