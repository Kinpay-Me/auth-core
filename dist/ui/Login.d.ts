/**
 * Shared Login screen. Self-contained look; all behavior is injected so each app
 * wires its own auth + router:
 *   <Login onSubmit={({identifier,password,staySignedIn}) => auth.login(...)} ... />
 *
 * Optional links (register / forgot / magic) render only when their href is
 * given, so an app can gate features by simply omitting them.
 */
import { type ReactNode } from "react";
import { type LinkLike } from "./primitives";
export interface LoginValues {
    identifier: string;
    password: string;
    staySignedIn: boolean;
}
export interface LoginProps {
    onSubmit: (values: LoginValues) => void | Promise<void>;
    error?: string | null;
    pending?: boolean;
    brand?: ReactNode;
    title?: ReactNode;
    subtitle?: ReactNode;
    theme?: "light" | "dark";
    badges?: string[];
    identifierLabel?: ReactNode;
    identifierPlaceholder?: string;
    /** Copy overrides — default to English so existing callers are unaffected.
     * A localized app passes its translated strings (e.g. Circles in Kiswahili). */
    passwordLabel?: ReactNode;
    forgotPasswordLabel?: ReactNode;
    staySignedInLabel?: ReactNode;
    submitLabel?: ReactNode;
    submitPendingLabel?: string;
    registerPrompt?: ReactNode;
    registerLabel?: ReactNode;
    magicLinkLabel?: ReactNode;
    /** Shown only if provided. */
    registerHref?: string;
    forgotPasswordHref?: string;
    magicLinkHref?: string;
    showStaySignedIn?: boolean;
    LinkComponent?: LinkLike;
}
export declare function Login({ onSubmit, error, pending, brand, title, subtitle, theme, badges, identifierLabel, identifierPlaceholder, passwordLabel, forgotPasswordLabel, staySignedInLabel, submitLabel, submitPendingLabel, registerPrompt, registerLabel, magicLinkLabel, registerHref, forgotPasswordHref, magicLinkHref, showStaySignedIn, LinkComponent, }: LoginProps): import("react").JSX.Element;
