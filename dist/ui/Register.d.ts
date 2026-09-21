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
    /** Prefill + lock (invite flows). */
    defaults?: Partial<RegisterValues>;
    emailLocked?: boolean;
    loginHref?: string;
    labels?: Partial<typeof DEFAULT_LABELS>;
    LinkComponent?: LinkLike;
}
export declare function Register({ onSubmit, error, pending, brand, theme, badges, notice, whatsappEnabled, defaults, emailLocked, loginHref, labels, LinkComponent, }: RegisterProps): import("react").JSX.Element;
export {};
