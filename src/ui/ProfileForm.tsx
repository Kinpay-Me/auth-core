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
import {
  AuthCard, AuthForm, Field, SelectField, SubmitButton, FormError, UserIcon, PhoneIcon,
} from "./primitives";
import { AuthStyles } from "./styles";

export interface ProfileValues {
  full_name: string;
  phone_number: string;
  preferred_language: string;
  preferred_currency: string;
  date_of_birth: string; // "" or YYYY-MM-DD
  street_address: string;
  country_of_residence: string;
}

export interface ProfileFormProps {
  /** Current values to prefill; `email` is shown read-only. */
  initial?: Partial<ProfileValues> & { email?: string | null };
  onSubmit: (values: ProfileValues) => void | Promise<void>;
  error?: string | null;
  pending?: boolean;

  /** Options for the two selects — apps pass their supported sets. */
  languageOptions?: { value: string; label: string }[];
  currencyOptions?: { value: string; label: string }[];

  brand?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  theme?: "light" | "dark";
  submitLabel?: ReactNode;
  /** Field labels — override for i18n. */
  labels?: Partial<{
    fullName: ReactNode; phone: ReactNode; email: ReactNode; language: ReactNode;
    currency: ReactNode; dob: ReactNode; address: ReactNode; country: ReactNode;
  }>;
}

const DEFAULT_LANGUAGES = [
  { value: "en", label: "English" },
  { value: "sw", label: "Kiswahili" },
];
const DEFAULT_CURRENCIES = [
  { value: "ZMW", label: "ZMW — Zambian Kwacha" },
  { value: "USD", label: "USD — US Dollar" },
];

export function ProfileForm({
  initial = {},
  onSubmit, error, pending,
  languageOptions = DEFAULT_LANGUAGES,
  currencyOptions = DEFAULT_CURRENCIES,
  brand, title = "Your details", subtitle = "Update your personal information.",
  theme, submitLabel = "Save changes",
  labels = {},
}: ProfileFormProps) {
  const l = {
    fullName: "Full name", phone: "Phone number", email: "Email", language: "Language",
    currency: "Currency", dob: "Date of birth", address: "Street address",
    country: "Country of residence", ...labels,
  };

  return (
    <AuthCard brand={brand} title={title} subtitle={subtitle} theme={theme}>
      <AuthStyles />
      <FormError message={error} />

      <AuthForm onSubmit={(data) => onSubmit({
        full_name: String(data.get("full_name") ?? "").trim(),
        phone_number: String(data.get("phone_number") ?? "").trim(),
        preferred_language: String(data.get("preferred_language") ?? ""),
        preferred_currency: String(data.get("preferred_currency") ?? ""),
        date_of_birth: String(data.get("date_of_birth") ?? ""),
        street_address: String(data.get("street_address") ?? "").trim(),
        country_of_residence: String(data.get("country_of_residence") ?? "").trim(),
      })}>
        <Field name="full_name" label={l.fullName} icon={<UserIcon />}
          defaultValue={initial.full_name ?? ""} autoComplete="name" required />

        <Field name="phone_number" label={l.phone} icon={<PhoneIcon />}
          type="tel" inputMode="tel" defaultValue={initial.phone_number ?? ""} autoComplete="tel" />

        {initial.email != null && (
          <Field name="email_display" label={l.email}
            defaultValue={initial.email ?? ""} readOnly autoComplete="email" />
        )}

        <SelectField name="preferred_language" label={l.language}
          options={languageOptions} defaultValue={initial.preferred_language} />

        <SelectField name="preferred_currency" label={l.currency}
          options={currencyOptions} defaultValue={initial.preferred_currency} />

        <Field name="date_of_birth" label={l.dob} type="date"
          defaultValue={initial.date_of_birth ?? ""} />

        <Field name="street_address" label={l.address}
          defaultValue={initial.street_address ?? ""} autoComplete="street-address" />

        <Field name="country_of_residence" label={l.country}
          defaultValue={initial.country_of_residence ?? ""} autoComplete="country-name" />

        <SubmitButton pending={pending} pendingLabel="Saving…">{submitLabel}</SubmitButton>
      </AuthForm>
    </AuthCard>
  );
}
