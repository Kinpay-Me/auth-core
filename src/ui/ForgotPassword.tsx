/**
 * Shared ForgotPassword screen. Presentation only — the app owns the
 * challenge/reset-token correlation; this component just walks a local step
 * machine ("email" → "otp" → "new-password" → "done") and calls one injected
 * callback per step, advancing only when that callback resolves.
 *
 * Copy is a single `labels` object with English defaults, so both apps render
 * identical wording out of the box; pass `labels` to translate.
 */
import { useState, type ReactNode } from "react";
import {
  AuthCard, AuthForm, Field, PasswordField, OtpField, StatusScreen,
  SubmitButton, FormError, AuthLink, MailIcon, type LinkLike,
} from "./primitives";

const PASSWORD_PATTERN = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,}$";

type Step = "email" | "otp" | "new-password" | "done";

const DEFAULT_LABELS = {
  // email step
  emailTitle: "Reset your password",
  emailSubtitle: "Enter your email and we'll send a reset code",
  email: "Email Address",
  emailPlaceholder: "you@example.com",
  requestSubmit: "Send Reset Code",
  requesting: "Sending…",
  // otp step
  otpTitle: "Check your email",
  otpSubtitle: "We sent a reset code to",
  otp: "Verification Code",
  verifySubmit: "Verify Code",
  verifying: "Verifying…",
  // new-password step
  passwordTitle: "Set new password",
  passwordSubtitle: "Choose a strong password for your account",
  password: "New Password",
  passwordSubmit: "Reset Password",
  settingPassword: "Resetting…",
  // done step
  doneTitle: "Password reset",
  doneMessage: "Your password has been updated. You can now sign in.",
  // shared
  backToLogin: "Back to Sign In",
  signIn: "Sign In",
};

export interface ForgotPasswordProps {
  onRequestReset: (email: string) => void | Promise<void>;
  onVerifyCode: (otp: string) => void | Promise<void>;
  onSetPassword: (newPassword: string) => void | Promise<void>;

  error?: string | null;
  pending?: boolean;

  brand?: ReactNode;
  theme?: "light" | "dark";
  badges?: string[];

  /** Shown as a "Back to Sign In" link and the success CTA when provided. */
  backToLoginHref?: string;

  labels?: Partial<typeof DEFAULT_LABELS>;
  LinkComponent?: LinkLike;
}

export function ForgotPassword({
  onRequestReset, onVerifyCode, onSetPassword,
  error, pending,
  brand, theme, badges,
  backToLoginHref,
  labels, LinkComponent,
}: ForgotPasswordProps) {
  const t = { ...DEFAULT_LABELS, ...labels };
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const isPending = pending || busy;

  // Runs a step callback and advances only when it resolves.
  const run = async (fn: () => void | Promise<void>, next: Step) => {
    setBusy(true);
    try {
      await fn();
      setStep(next);
    } finally {
      setBusy(false);
    }
  };

  const backLink = backToLoginHref ? (
    <div className="kpa-foot">
      <AuthLink href={backToLoginHref} className="kpa-link" LinkComponent={LinkComponent}>
        {t.backToLogin}
      </AuthLink>
    </div>
  ) : null;

  if (step === "done") {
    return (
      <AuthCard brand={brand} theme={theme} badges={badges}>
        <StatusScreen
          variant="success"
          title={t.doneTitle}
          message={t.doneMessage}
          action={backToLoginHref ? (
            <AuthLink href={backToLoginHref} className="kpa-btn" LinkComponent={LinkComponent}>
              {t.signIn}
            </AuthLink>
          ) : undefined}
        />
      </AuthCard>
    );
  }

  if (step === "new-password") {
    return (
      <AuthCard brand={brand} title={t.passwordTitle} subtitle={t.passwordSubtitle} theme={theme} badges={badges}>
        <FormError message={error} />
        <AuthForm onSubmit={() => run(() => onSetPassword(password), "done")}>
          <PasswordField
            label={t.password} autoComplete="new-password"
            minLength={8} pattern={PASSWORD_PATTERN}
            value={password} onValueChange={setPassword} strength
          />
          <SubmitButton pending={isPending} pendingLabel={t.settingPassword}>{t.passwordSubmit}</SubmitButton>
        </AuthForm>
        {backLink}
      </AuthCard>
    );
  }

  if (step === "otp") {
    return (
      <AuthCard
        brand={brand} title={t.otpTitle} theme={theme} badges={badges}
        subtitle={<>{t.otpSubtitle}<br /><strong>{email}</strong></>}
      >
        <FormError message={error} />
        <AuthForm onSubmit={(data) => run(() => onVerifyCode(String(data.get("otp") ?? "")), "new-password")}>
          <OtpField label={t.otp} autoFocus />
          <SubmitButton pending={isPending} pendingLabel={t.verifying}>{t.verifySubmit}</SubmitButton>
        </AuthForm>
        {backLink}
      </AuthCard>
    );
  }

  // "email" step (default)
  return (
    <AuthCard brand={brand} title={t.emailTitle} subtitle={t.emailSubtitle} theme={theme} badges={badges}>
      <FormError message={error} />
      <AuthForm onSubmit={(data) => {
        const value = String(data.get("email") ?? "");
        setEmail(value);
        run(() => onRequestReset(value), "otp");
      }}>
        <Field
          name="email" type="email" label={t.email} icon={<MailIcon />}
          autoComplete="email" placeholder={t.emailPlaceholder} required
        />
        <SubmitButton pending={isPending} pendingLabel={t.requesting}>{t.requestSubmit}</SubmitButton>
      </AuthForm>
      {backLink}
    </AuthCard>
  );
}
