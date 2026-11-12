/**
 * Shared Register screen. Presentation only — behavior via props. Mirrors the
 * app's register form: full name, email, phone (required only when the WhatsApp
 * phone-verify gate is on), and a password with a live strength meter.
 *
 * Copy is a single `labels` object with English defaults, so both apps render
 * identical wording out of the box; pass `labels` to translate.
 */
import { useState, type ReactNode } from "react";
import {
  AuthCard, AuthForm, Field, PasswordField, SubmitButton, FormError, AuthSwitch,
  UserIcon, MailIcon, PhoneIcon, type LinkLike,
} from "./primitives";

const PASSWORD_PATTERN = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,}$";

export interface RegisterValues {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}

const DEFAULT_LABELS = {
  title: "Create your Account",
  subtitle: "Join the most trusted peer-to-peer lending network",
  fullName: "Full Name",
  fullNamePlaceholder: "Your full name",
  email: "Email Address",
  emailPlaceholder: "you@example.com",
  phone: "Mobile Number",
  phoneOptional: "Mobile Number (Optional)",
  phonePlaceholder: "+27 XX XXX XXXX",
  password: "Password",
  submit: "Sign Up",
  submitting: "Creating account…",
  haveAccount: "Already have an account?",
  signIn: "Sign In",
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
  renderPhoneInput?: (props: { name: "phone"; id: string; defaultValue: string; required: boolean }) => ReactNode;
  /** Inline message under the phone field (e.g. live format validation). */
  phoneError?: ReactNode;

  loginHref?: string;
  /** The sign-in way as a full outlined button under a divider, not a small link. */
  loginAsButton?: boolean;
  labels?: Partial<typeof DEFAULT_LABELS>;
  LinkComponent?: LinkLike;
}

export function Register({
  onSubmit, error, pending,
  brand, theme, badges, notice,
  whatsappEnabled = false, showPhone = true,
  defaults, emailLocked,
  loginHref, loginAsButton = false, labels, LinkComponent,
  renderPhoneInput, phoneError,
}: RegisterProps) {
  const t = { ...DEFAULT_LABELS, ...labels };
  const [password, setPassword] = useState(defaults?.password ?? "");

  return (
    <AuthCard brand={brand} title={t.title} subtitle={t.subtitle} theme={theme} badges={badges}>
      {notice}
      <FormError message={error} />

      <AuthForm onSubmit={(data) => onSubmit({
        fullName: String(data.get("fullName") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: showPhone ? String(data.get("phone") ?? "") || undefined : undefined,
        password,
      })}>
        <Field
          name="fullName" label={t.fullName} icon={<UserIcon />}
          autoComplete="name" placeholder={t.fullNamePlaceholder}
          required defaultValue={defaults?.fullName}
        />
        <Field
          name="email" type="email" label={t.email} icon={<MailIcon />}
          autoComplete="email" placeholder={t.emailPlaceholder}
          required defaultValue={defaults?.email}
          {...(emailLocked ? { readOnly: true } : {})}
        />
        {!showPhone ? null : renderPhoneInput ? (
          <div className="kpa-field">
            <label htmlFor="phone" className="kpa-label">{whatsappEnabled ? t.phone : t.phoneOptional}</label>
            <div className="kpa-phone-slot" data-invalid={phoneError ? "true" : undefined}>
              {renderPhoneInput({ name: "phone", id: "phone", defaultValue: defaults?.phone ?? "", required: whatsappEnabled })}
            </div>
            {phoneError && <p className="kpa-field-error" role="alert">{phoneError}</p>}
          </div>
        ) : (
          <Field
            name="phone" type="tel" icon={<PhoneIcon />}
            label={whatsappEnabled ? t.phone : t.phoneOptional}
            autoComplete="tel" placeholder={t.phonePlaceholder}
            required={whatsappEnabled} defaultValue={defaults?.phone}
          />
        )}
        <PasswordField
          label={t.password} autoComplete="new-password"
          minLength={8} pattern={PASSWORD_PATTERN}
          value={password} onValueChange={setPassword} strength
        />

        <SubmitButton pending={pending} pendingLabel={t.submitting}>{t.submit}</SubmitButton>
      </AuthForm>

      {loginHref && (
        <AuthSwitch prompt={t.haveAccount} label={t.signIn} href={loginHref} button={loginAsButton} LinkComponent={LinkComponent} />
      )}
    </AuthCard>
  );
}
