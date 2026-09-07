/**
 * Shared building blocks for the auth screens. Self-contained: inline SVG icons
 * (no icon-library dependency), styling via the `.kpa-*` classes from styles.ts.
 * Navigation is injected — pass `LinkComponent` (e.g. an adapter around your
 * router's Link) to keep client-side routing; it falls back to a plain <a>.
 */
import { type ComponentType, type ReactNode, type FormEvent } from "react";
/** A router-agnostic link. Apps adapt their <Link to=…> to this href-based shape. */
export type LinkLike = ComponentType<{
    href: string;
    className?: string;
    children: ReactNode;
    "aria-label"?: string;
}>;
export interface NavProps {
    /** Client-side link component; defaults to a plain <a>. */
    LinkComponent?: LinkLike;
}
export declare function AuthLink({ href, className, children, LinkComponent, ...rest }: {
    href: string;
    className?: string;
    children: ReactNode;
    "aria-label"?: string;
} & NavProps): import("react").JSX.Element;
type IconProps = {
    size?: number;
};
export declare const MailIcon: ({ size }: IconProps) => import("react").JSX.Element;
export declare const LockIcon: ({ size }: IconProps) => import("react").JSX.Element;
export declare const PhoneIcon: ({ size }: IconProps) => import("react").JSX.Element;
export declare const UserIcon: ({ size }: IconProps) => import("react").JSX.Element;
export declare const EyeIcon: ({ size }: IconProps) => import("react").JSX.Element;
export declare const EyeOffIcon: ({ size }: IconProps) => import("react").JSX.Element;
export declare const CheckIcon: ({ size }: IconProps) => import("react").JSX.Element;
export interface AuthCardProps {
    /** Optional brand/logo rendered centered above the heading. */
    brand?: ReactNode;
    title?: ReactNode;
    subtitle?: ReactNode;
    /** Force a theme; defaults to following the OS (prefers-color-scheme). */
    theme?: "light" | "dark";
    children: ReactNode;
    /** Optional trust badges row, e.g. ["Safe", "Credible", "Community driven"]. */
    badges?: string[];
}
export declare function AuthCard({ brand, title, subtitle, theme, children, badges }: AuthCardProps): import("react").JSX.Element;
export interface FieldProps {
    name: string;
    label?: ReactNode;
    labelExtra?: ReactNode;
    icon?: ReactNode;
    type?: string;
    placeholder?: string;
    required?: boolean;
    autoComplete?: string;
    defaultValue?: string;
}
export declare function Field({ name, label, labelExtra, icon, type, ...input }: FieldProps): import("react").JSX.Element;
export declare function PasswordField({ name, label, labelExtra, autoComplete, required, placeholder }: Partial<FieldProps>): import("react").JSX.Element;
export declare function Checkbox({ checked, onChange, children }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    children: ReactNode;
}): import("react").JSX.Element;
export declare function SubmitButton({ pending, children, pendingLabel }: {
    pending?: boolean;
    children: ReactNode;
    pendingLabel?: ReactNode;
}): import("react").JSX.Element;
export declare function FormError({ message }: {
    message?: string | null;
}): import("react").JSX.Element | null;
export declare function Divider({ label }: {
    label?: string;
}): import("react").JSX.Element;
/** Wraps children in a <form> whose submit reads the fields and calls onValues. */
export declare function AuthForm({ onSubmit, children }: {
    onSubmit: (data: FormData, e: FormEvent<HTMLFormElement>) => void;
    children: ReactNode;
}): import("react").JSX.Element;
export {};
