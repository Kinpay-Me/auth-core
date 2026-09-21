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
  AuthCard, AuthForm, Field, PasswordField, SubmitButton, FormError, AuthLink,
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

  /** Prefill + lock (invite flows). */
  defaults?: Partial<RegisterValues>;
  emailLocked?: boolean;

  loginHref?: string;
  labels?: Partial<typeof DEFAULT_LABELS>;
  LinkComponent?: LinkLike;
}

export function Register({
  onSubmit, error, pending,
  brand, theme, badges, notice,
  whatsappEnabled = false,
  defaults, emailLocked,
  loginHref, labels, LinkComponent,
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
        phone: String(data.get("phone") ?? "") || undefined,
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
        <Field
          name="phone" type="tel" icon={<PhoneIcon />}
          label={whatsappEnabled ? t.phone : t.phoneOptional}
          autoComplete="tel" placeholder={t.phonePlaceholder}
          required={whatsappEnabled} defaultValue={defaults?.phone}
        />
        <PasswordField
          label={t.password} autoComplete="new-password"
          minLength={8} pattern={PASSWORD_PATTERN}
          value={password} onValueChange={setPassword} strength
        />

        <SubmitButton pending={pending} pendingLabel={t.submitting}>{t.submit}</SubmitButton>
      </AuthForm>

      {loginHref && (
        <div className="kpa-foot">
          {t.haveAccount}{" "}
          <AuthLink href={loginHref} className="kpa-link" LinkComponent={LinkComponent}>
            {t.signIn}
          </AuthLink>
        </div>
      )}
    </AuthCard>
  );
}
