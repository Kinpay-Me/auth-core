/**
 * Shared Login screen. Self-contained look; all behavior is injected so each app
 * wires its own auth + router:
 *   <Login onSubmit={({identifier,password,staySignedIn}) => auth.login(...)} ... />
 *
 * Optional links (register / forgot / magic) render only when their href is
 * given, so an app can gate features by simply omitting them.
 */
import { useState, type ReactNode } from "react";
import {
  AuthCard, AuthForm, Field, PasswordField, Checkbox, SubmitButton, FormError,
  Divider, AuthLink, MailIcon, type LinkLike,
} from "./primitives";

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

export function Login({
  onSubmit, error, pending,
  brand, title = "Welcome back!",
  subtitle = "The simplest way to structure loans between people who trust each other",
  theme, badges,
  identifierLabel = "Phone number or Email",
  identifierPlaceholder = "e.g. +47 900 00 000",
  passwordLabel = "Password",
  forgotPasswordLabel = "Forgot password?",
  staySignedInLabel = "Stay signed in for 30 days",
  submitLabel = "Sign In",
  submitPendingLabel = "Signing in…",
  registerPrompt = "New to KinPay?",
  registerLabel = "Create an Account",
  magicLinkLabel = "Email me a sign-in link",
  registerHref, forgotPasswordHref, magicLinkHref,
  showStaySignedIn = true,
  LinkComponent,
}: LoginProps) {
  const [staySignedIn, setStaySignedIn] = useState(false);

  return (
    <AuthCard brand={brand} title={title} subtitle={subtitle} theme={theme} badges={badges}>
      <FormError message={error} />

      <AuthForm onSubmit={(data) => onSubmit({
        identifier: String(data.get("identifier") ?? ""),
        password: String(data.get("password") ?? ""),
        staySignedIn,
      })}>
        <Field
          name="identifier"
          label={identifierLabel}
          icon={<MailIcon />}
          autoComplete="username"
          placeholder={identifierPlaceholder}
          required
        />

        <PasswordField
          label={passwordLabel}
          labelExtra={forgotPasswordHref ? (
            <AuthLink href={forgotPasswordHref} className="kpa-link kpa-link-sm" LinkComponent={LinkComponent}>
              {forgotPasswordLabel}
            </AuthLink>
          ) : undefined}
        />

        {showStaySignedIn && (
          <Checkbox checked={staySignedIn} onChange={setStaySignedIn}>
            {staySignedInLabel}
          </Checkbox>
        )}

        <SubmitButton pending={pending} pendingLabel={submitPendingLabel}>{submitLabel}</SubmitButton>
      </AuthForm>

      {registerHref && (
        <div className="kpa-foot">
          {registerPrompt}{" "}
          <AuthLink href={registerHref} className="kpa-link" LinkComponent={LinkComponent}>
            {registerLabel}
          </AuthLink>
        </div>
      )}

      {magicLinkHref && (
        <>
          <Divider />
          <div className="kpa-alts">
            <AuthLink
              href={magicLinkHref}
              className="kpa-btn kpa-btn-secondary"
              aria-label={typeof magicLinkLabel === "string" ? magicLinkLabel : "Email me a sign-in link"}
              LinkComponent={LinkComponent}
            >
              <MailIcon size={16} />
              {magicLinkLabel}
            </AuthLink>
          </div>
        </>
      )}
    </AuthCard>
  );
}
