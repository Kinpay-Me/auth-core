/**
 * Shared Register screen. Presentation only — behavior via props. Mirrors the
 * app's register form: full name, email, phone (required only when the WhatsApp
 * phone-verify gate is on), and a password with a live strength meter.
 *
 * Copy is a single `labels` object with English defaults, so both apps render
 * identical wording out of the box; pass `labels` to translate.
 */
import { type ReactNode } from "react";
import { type LinkLike } from "./primitives";
export interface RegisterValues {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
}
declare const DEFAULT_LABELS: {
    title: string;
    subtitle: string;
    fullName: string;
    fullNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phoneOptional: string;
    phonePlaceholder: string;
    password: string;
    submit: string;
    submitting: string;
    haveAccount: string;
    signIn: string;
};
export interface RegisterProps {
    onSubmit: (values: RegisterValues) => void | Promise<void>;
    error?: string | null;
    pending?: boolean;
    brand?: ReactNode;
    theme?: "light" | "dark";
    badges?: string[];
    /** Optional banner above the form (e.g. an invite notice). */
    notice?: ReactNode;
    /** When on, phone is required and labelled without "(Optional)". */
    whatsappEnabled?: boolean;
    /** Off leaves the phone field out entirely (an email-only sign-up); `phone` is then undefined. */
    showPhone?: boolean;
    /** Prefill + lock (invite flows). */
    defaults?: Partial<RegisterValues>;
    emailLocked?: boolean;
    /**
     * Replace the plain phone text input with the app's own phone control (e.g. a
     * country picker + dial-code prefix). Rendered inside the labelled field; it
     * MUST submit its value under `name` (a hidden input is fine).
     */
    renderPhoneInput?: (props: {
        name: "phone";
        id: string;
        defaultValue: string;
        required: boolean;
    }) => ReactNode;
    /** Inline message under the phone field (e.g. live format validation). */
    phoneError?: ReactNode;
    loginHref?: string;
    /** The sign-in way as a full outlined button under a divider, not a small link. */
    loginAsButton?: boolean;
    labels?: Partial<typeof DEFAULT_LABELS>;
    LinkComponent?: LinkLike;
}
export declare function Register({ onSubmit, error, pending, brand, theme, badges, notice, whatsappEnabled, showPhone, defaults, emailLocked, loginHref, loginAsButton, labels, LinkComponent, renderPhoneInput, phoneError, }: RegisterProps): import("react").JSX.Element;
export {};
