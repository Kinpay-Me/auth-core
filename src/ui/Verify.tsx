/**
 * Shared Verify screen: prove the email or phone number on an account with a
 * six-digit code. Presentation only — the app owns the calls (KinPay's
 * /auth/verify/{email,phone}/{request,confirm}) and the challenge id; this
 * component walks "send" → "code" → "done" per contact and calls one injected
 * callback per step, advancing only when it resolves.
 *
 * An account can have an email, a phone number, or both: `contacts` lists the
 * ones it can verify, and the screen offers to switch to the other one. Codes
 * are texted (SMS) to a phone and emailed to an email.
 *
 * Copy is a single `labels` object with English defaults, so both apps render
 * identical wording out of the box; pass `labels` to translate.
 */
import { useEffect, useState, type ReactNode } from "react";
import {
  AuthCard, AuthForm, OtpField, StatusScreen, SubmitButton, FormError, Divider,
  AuthLink, MailIcon, PhoneIcon, type LinkLike,
} from "./primitives";

export type VerifyChannel = "email" | "phone";

export interface VerifyContact {
  channel: VerifyChannel;
  /** What the code goes to, as the reader should see it: the email, or the number (masked or not). */
  contact: string;
}

const DEFAULT_LABELS = {
  emailTitle: "Verify your email",
  phoneTitle: "Verify your phone number",
  emailIntro: "We'll email a six-digit code to",
  phoneIntro: "We'll text a six-digit code to",
  sendCode: "Send the code",
  sending: "Sending…",
  emailSent: "We emailed a six-digit code to",
  phoneSent: "We texted a six-digit code to",
  otp: "Code",
  verify: "Verify",
  verifying: "Verifying…",
  resendIn: "Send a new code in {seconds}s",
  resend: "Send a new code",
  useEmail: "Verify your email instead",
  usePhone: "Verify your phone number instead",
  doneEmail: "Your email is verified",
  donePhone: "Your phone number is verified",
  doneMessage: "Thank you. You can carry on.",
  continue: "Continue",
  signOut: "Sign out",
};

export interface VerifyProps {
  /** The contacts the account can verify; the first is offered first. */
  contacts: VerifyContact[];
  /** Ask for a code. Resolve with the seconds before another may be sent (default 60). */
  onSendCode: (channel: VerifyChannel) => Promise<{ resendInSeconds?: number } | void>;
  /** Check the code; resolve when it is right, throw (and set `error`) when not. */
  onConfirm: (channel: VerifyChannel, code: string) => void | Promise<void>;
  /** After a contact is verified: the "Continue" button. Without it, no done screen: onConfirm is the end. */
  onContinue?: () => void;

  error?: string | null;
  pending?: boolean;
  /** Called when the reader switches contact or a step changes, so the app can clear its error. */
  onStepChange?: () => void;

  brand?: ReactNode;
  theme?: "light" | "dark";
  badges?: string[];
  /** A way out for someone who cannot get the code: a "Sign out" link. */
  signOutHref?: string;
  /** Shown under the form (e.g. a development build's code). */
  footer?: ReactNode;

  labels?: Partial<typeof DEFAULT_LABELS>;
  LinkComponent?: LinkLike;
}

type Step = "send" | "code" | "done";

export function Verify({
  contacts, onSendCode, onConfirm, onContinue,
  error, pending, onStepChange,
  brand, theme, badges, signOutHref, footer,
  labels, LinkComponent,
}: VerifyProps) {
  const t = { ...DEFAULT_LABELS, ...labels };
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState<Step>("send");
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(0);
  const isPending = pending || busy;

  // The resend countdown: one code a minute (the server answers 429 sooner anyway)
  useEffect(() => {
    if (wait <= 0) return;
    const id = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(id);
  }, [wait]);

  const current = contacts[index];
  if (!current) return null;
  const isPhone = current.channel === "phone";
  const other = contacts.findIndex((c, i) => i !== index && c.channel !== current.channel);

  const go = (next: Step) => {
    setStep(next);
    onStepChange?.();
  };
  const send = async () => {
    setBusy(true);
    try {
      const res = await onSendCode(current.channel);
      setWait((res && res.resendInSeconds) ?? 60);
      go("code");
    } finally {
      setBusy(false);
    }
  };
  const confirm = async (code: string) => {
    setBusy(true);
    try {
      await onConfirm(current.channel, code);
      if (onContinue) go("done");
    } finally {
      setBusy(false);
    }
  };
  const switchTo = (i: number) => {
    setIndex(i);
    setWait(0);
    go("send");
  };

  const title = isPhone ? t.phoneTitle : t.emailTitle;
  const icon = isPhone ? <PhoneIcon /> : <MailIcon />;

  if (step === "done") {
    return (
      <AuthCard brand={brand} theme={theme} badges={badges}>
        <StatusScreen
          variant="success"
          title={isPhone ? t.donePhone : t.doneEmail}
          message={t.doneMessage}
          action={<button type="button" className="kpa-btn" onClick={onContinue}>{t.continue}</button>}
        />
      </AuthCard>
    );
  }

  const switcher = other >= 0 ? (
    <>
      <Divider />
      <div className="kpa-alts">
        <button type="button" className="kpa-btn kpa-btn-secondary" onClick={() => switchTo(other)}>
          {contacts[other].channel === "phone" ? <PhoneIcon /> : <MailIcon />}
          {contacts[other].channel === "phone" ? t.usePhone : t.useEmail}
        </button>
      </div>
    </>
  ) : null;
  const foot = signOutHref ? (
    <div className="kpa-foot">
      <AuthLink href={signOutHref} className="kpa-link" LinkComponent={LinkComponent}>{t.signOut}</AuthLink>
    </div>
  ) : null;

  if (step === "code") {
    return (
      <AuthCard
        brand={brand} title={title} theme={theme} badges={badges}
        subtitle={<>{isPhone ? t.phoneSent : t.emailSent}<br /><strong>{current.contact}</strong></>}
      >
        <FormError message={error} />
        <AuthForm onSubmit={(data) => confirm(String(data.get("otp") ?? "").trim())}>
          <OtpField label={t.otp} autoFocus />
          <SubmitButton pending={isPending} pendingLabel={t.verifying}>{t.verify}</SubmitButton>
        </AuthForm>
        <div className="kpa-foot">
          {wait > 0 ? (
            <span>{t.resendIn.replace("{seconds}", String(wait))}</span>
          ) : (
            <button type="button" className="kpa-link" disabled={isPending} onClick={send}>{t.resend}</button>
          )}
        </div>
        {footer}
        {switcher}
        {foot}
      </AuthCard>
    );
  }

  // "send" (default): say where the code goes before spending a text on it
  return (
    <AuthCard
      brand={brand} title={title} theme={theme} badges={badges}
      subtitle={<>{isPhone ? t.phoneIntro : t.emailIntro}<br /><strong>{current.contact}</strong></>}
    >
      <FormError message={error} />
      <AuthForm onSubmit={send}>
        <SubmitButton pending={isPending} pendingLabel={t.sending}>{icon}{t.sendCode}</SubmitButton>
      </AuthForm>
      {footer}
      {switcher}
      {foot}
    </AuthCard>
  );
}
