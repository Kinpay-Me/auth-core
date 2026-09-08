/**
 * Shared account/profile editor. Like the auth screens, it owns its look and
 * takes all behavior via props — each app wires the submit to its own
 * `PATCH /users/me`. Only the CORE identity fields the monolith accepts live
 * here; app-specific extras (avatar upload, username/handle, payment methods)
 * stay in the consuming app.
 *
 *   <ProfileForm initial={user} onSubmit={(v) => api.patch("/users/me", v)} />
 *
 * Uncontrolled (FormData) — email is display-only (it changes via verification,
 * not this endpoint) and is never submitted.
 */
import { type ReactNode } from "react";
export interface ProfileValues {
    full_name: string;
    phone_number: string;
    preferred_language: string;
    preferred_currency: string;
    date_of_birth: string;
    street_address: string;
    country_of_residence: string;
}
export interface ProfileFormProps {
    /** Current values to prefill; `email` is shown read-only. */
    initial?: Partial<ProfileValues> & {
        email?: string | null;
    };
    onSubmit: (values: ProfileValues) => void | Promise<void>;
    error?: string | null;
    pending?: boolean;
    /** Options for the two selects — apps pass their supported sets. */
    languageOptions?: {
        value: string;
        label: string;
    }[];
    currencyOptions?: {
        value: string;
        label: string;
    }[];
    brand?: ReactNode;
    title?: ReactNode;
    subtitle?: ReactNode;
    theme?: "light" | "dark";
    submitLabel?: ReactNode;
    /** Field labels — override for i18n. */
    labels?: Partial<{
        fullName: ReactNode;
        phone: ReactNode;
        email: ReactNode;
        language: ReactNode;
        currency: ReactNode;
        dob: ReactNode;
        address: ReactNode;
        country: ReactNode;
    }>;
}
export declare function ProfileForm({ initial, onSubmit, error, pending, languageOptions, currencyOptions, brand, title, subtitle, theme, submitLabel, labels, }: ProfileFormProps): import("react").JSX.Element;
