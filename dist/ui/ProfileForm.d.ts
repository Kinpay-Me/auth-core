/**
 * Shared account/profile editor. Like the auth screens, it owns its look and
 * takes all behavior via props — each app wires the submit to its own
 * `PATCH /users/me`. Only the CORE identity fields the monolith accepts live
 * here; app-specific extras (avatar upload, username/handle, payment methods)
 * stay in the consuming app.
 *
 *   // Standalone auth-style card (default):
 *   <ProfileForm initial={user} onSubmit={(v) => api.patch("/users/me", v)} />
 *
 *   // Embedded in an app page — left-aligned, two-column, identity strip:
 *   <ProfileForm layout="embedded" initial={user} onSubmit={…} />
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
    /**
     * "auth" (default) renders the standalone centered card, matching the login /
     * register screens. "embedded" renders a left-aligned, full-width block with an
     * identity strip and a responsive two-column grid, for dropping into an app
     * page — the same look in every app that hosts it.
     */
    layout?: "auth" | "embedded";
    /** Optional avatar image for the embedded identity strip; falls back to initials. */
    avatarUrl?: string | null;
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
export declare function ProfileForm({ initial, onSubmit, error, pending, layout, avatarUrl, languageOptions, currencyOptions, brand, title, subtitle, theme, submitLabel, labels, }: ProfileFormProps): import("react").JSX.Element;
