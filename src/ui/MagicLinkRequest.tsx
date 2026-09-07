/**
 * Shared Magic-Link request screen. Presentation only — behavior via props.
 * Mirrors the app's passwordless flow: one identifier (email) field + submit,
 * then a "check your inbox" confirmation showing the identifier we sent to.
 *
 * The sent/not-sent UI state is managed locally: `onSubmit` is called with the
 * identifier and, once it resolves, the confirmation is shown. Copy is a single
 * `labels` object with English defaults, so both apps render identical wording
 * out of the box; pass `labels` to translate.
 */
import { useState, type ReactNode } from "react";
import {
  AuthCard, AuthForm, Field, SubmitButton, FormError, StatusScreen, AuthLink,
  MailIcon, type LinkLike,
} from "./primitives";

const DEFAULT_LABELS = {
  title: "Sign in with email",
  subtitle:
    "Enter your email and we'll send you a link that signs you in instantly — no password needed.",
  identifier: "Email address",
  identifierPlaceholder: "your@email.com",
  submit: "Send login link",
  submitting: "Sending…",
  /** Confirmation heading once the link is sent. */
  sentTitle: "Check your email",
  /** Message wraps the identifier: `{before} <strong>X</strong>. {after}` */
  sentMessageBefore: "We sent a login link to",
  sentMessageAfter: "It expires in 15 minutes.",
  backToLogin: "Back to Sign In",
  useDifferent: "Use a different email",
};

export interface MagicLinkRequestProps {
  /** Called with the entered identifier; resolving shows the sent confirmation. */
  onSubmit: (identifier: string) => void | Promise<void>;
  error?: string | null;
  pending?: boolean;

  brand?: ReactNode;
  theme?: "light" | "dark";
  badges?: string[];

  /** Shown as a link on both the form and the confirmation when provided. */
  backToLoginHref?: string;

  labels?: Partial<typeof DEFAULT_LABELS>;
  LinkComponent?: LinkLike;
}

export function MagicLinkRequest({
  onSubmit, error, pending,
  brand, theme, badges,
  backToLoginHref, labels, LinkComponent,
}: MagicLinkRequestProps) {
  const t = { ...DEFAULT_LABELS, ...labels };
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(identifier: string) {
    setSubmitting(true);
    try {
      await onSubmit(identifier);
      setSentTo(identifier);
    } finally {
      setSubmitting(false);
    }
  }

  if (sentTo) {
    return (
      <AuthCard brand={brand} theme={theme} badges={badges}>
        <StatusScreen
          variant="success"
          title={t.sentTitle}
          message={<>{t.sentMessageBefore} <strong>{sentTo}</strong>. {t.sentMessageAfter}</>}
          action={
            <div className="kpa-alts">
              {backToLoginHref && (
                <AuthLink
                  href={backToLoginHref}
                  className="kpa-btn"
                  LinkComponent={LinkComponent}
                >
                  {t.backToLogin}
                </AuthLink>
              )}
              <button
                type="button"
                className="kpa-btn kpa-btn-secondary"
                onClick={() => setSentTo(null)}
              >
                {t.useDifferent}
              </button>
            </div>
          }
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard brand={brand} title={t.title} subtitle={t.subtitle} theme={theme} badges={badges}>
      <FormError message={error} />

      <AuthForm onSubmit={(data) => handleSubmit(String(data.get("identifier") ?? ""))}>
        <Field
          name="identifier"
          type="email"
          label={t.identifier}
          icon={<MailIcon />}
          autoComplete="email"
          placeholder={t.identifierPlaceholder}
          required
        />

        <SubmitButton pending={pending || submitting} pendingLabel={t.submitting}>
          {t.submit}
        </SubmitButton>
      </AuthForm>

      {backToLoginHref && (
        <div className="kpa-foot">
          <AuthLink href={backToLoginHref} className="kpa-link" LinkComponent={LinkComponent}>
            {t.backToLogin}
          </AuthLink>
        </div>
      )}
    </AuthCard>
  );
}
