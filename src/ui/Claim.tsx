/**
 * Shared Claim screen. A member whose account was provisioned for them at the
 * desk (a "shell" — no password) proves their identifier via OTP and sets a
 * first password, landing signed in. Presentation only — behavior via props.
 *
 * Two steps are managed as internal state ("identifier" → "verify"). The app
 * owns the challenge id / API correlation; this component only calls the two
 * callbacks: `onRequestCode(identifier)` then `onVerify({ otp, password })`.
 *
 * A WhatsApp gate governs phone OTP delivery in the source route; here it is a
 * `whatsappEnabled` prop that adjusts copy only (phone+email vs email-only).
 *
 * Copy is a single `labels` object with English defaults, so both apps render
 * identical wording out of the box; pass `labels` to translate.
 */
import { useState, type ReactNode } from "react";
import {
  AuthCard, AuthForm, Field, PasswordField, OtpField, SubmitButton, FormError,
  AuthLink, MailIcon, type LinkLike,
} from "./primitives";

const PASSWORD_PATTERN = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,}$";

export interface ClaimValues {
  otp: string;
  password: string;
}

const DEFAULT_LABELS = {
  title: "Claim your account",
  /** Step 1 subtitle when phone claims are available (WhatsApp on). */
  subtitleIdentifier: "Your circle manager set up an account for you. Enter your phone number or email to claim it.",
  /** Step 1 subtitle when only email claims can be delivered (WhatsApp off). */
  subtitleIdentifierEmailOnly: "Your circle manager set up an account for you. Enter your email to claim it.",
  /** Step 2 subtitle; `{identifier}` is replaced with the value being claimed. */
  subtitleVerify: "Enter the code we sent to {identifier}, then choose a password.",

  identifierPhoneOrEmail: "Phone number or email",
  identifierEmail: "Email address",
  identifierPhoneOrEmailPlaceholder: "Phone number or email",
  identifierEmailPlaceholder: "you@example.com",

  sendCode: "Send code",
  sending: "Sending…",

  otp: "Verification code",
  password: "Choose a password",
  submit: "Claim & sign in",
  submitting: "Setting up…",

  changeIdentifier: "Use a different phone or email",
  changeIdentifierEmailOnly: "Use a different email",

  haveAccount: "Already set up your account?",
  signIn: "Sign in",
};

export interface ClaimProps {
  /** Step 1: request a code for the entered identifier. Resolve to advance. */
  onRequestCode: (identifier: string) => void | Promise<void>;
  /** Step 2: verify the code and set the first password. */
  onVerify: (values: ClaimValues) => void | Promise<void>;

  error?: string | null;
  pending?: boolean;

  /** When on, phone claims are available and the copy invites phone-or-email. */
  whatsappEnabled?: boolean;

  brand?: ReactNode;
  theme?: "light" | "dark";
  badges?: string[];

  /** Shown only if provided: a way out to the normal sign-in screen. */
  backToLoginHref?: string;

  labels?: Partial<typeof DEFAULT_LABELS>;
  LinkComponent?: LinkLike;
}

export function Claim({
  onRequestCode, onVerify, error, pending,
  whatsappEnabled = false,
  brand, theme, badges,
  backToLoginHref, labels, LinkComponent,
}: ClaimProps) {
  const t = { ...DEFAULT_LABELS, ...labels };
  const [step, setStep] = useState<"identifier" | "verify">("identifier");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  async function requestCode(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setIdentifier(trimmed);
    try {
      await onRequestCode(trimmed);
      setStep("verify");
    } catch {
      // The app surfaces the reason via `error`; stay on step 1 to retry.
    }
  }

  const subtitle =
    step === "identifier"
      ? whatsappEnabled ? t.subtitleIdentifier : t.subtitleIdentifierEmailOnly
      : t.subtitleVerify.replace("{identifier}", identifier);

  return (
    <AuthCard brand={brand} title={t.title} subtitle={subtitle} theme={theme} badges={badges}>
      <FormError message={error} />

      {step === "identifier" ? (
        <AuthForm onSubmit={(data) => requestCode(String(data.get("identifier") ?? ""))}>
          <Field
            name="identifier"
            type={whatsappEnabled ? "text" : "email"}
            inputMode={whatsappEnabled ? "text" : "email"}
            label={whatsappEnabled ? t.identifierPhoneOrEmail : t.identifierEmail}
            placeholder={whatsappEnabled ? t.identifierPhoneOrEmailPlaceholder : t.identifierEmailPlaceholder}
            icon={<MailIcon />}
            autoComplete="username"
            required
          />
          <SubmitButton pending={pending} pendingLabel={t.sending}>{t.sendCode}</SubmitButton>
        </AuthForm>
      ) : (
        <AuthForm onSubmit={(data) => onVerify({
          otp: String(data.get("otp") ?? "").trim(),
          password,
        })}>
          <OtpField label={t.otp} autoFocus />
          <PasswordField
            label={t.password} autoComplete="new-password"
            minLength={8} pattern={PASSWORD_PATTERN}
            value={password} onValueChange={setPassword} strength
          />
          <SubmitButton pending={pending} pendingLabel={t.submitting}>{t.submit}</SubmitButton>

          <div className="kpa-foot">
            <button
              type="button"
              className="kpa-link"
              onClick={() => setStep("identifier")}
            >
              {whatsappEnabled ? t.changeIdentifier : t.changeIdentifierEmailOnly}
            </button>
          </div>
        </AuthForm>
      )}

      {backToLoginHref && (
        <div className="kpa-foot">
          {t.haveAccount}{" "}
          <AuthLink href={backToLoginHref} className="kpa-link" LinkComponent={LinkComponent}>
            {t.signIn}
          </AuthLink>
        </div>
      )}
    </AuthCard>
  );
}
