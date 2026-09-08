/**
 * Shared building blocks for the auth screens. Self-contained: inline SVG icons
 * (no icon-library dependency), styling via the `.kpa-*` classes from styles.ts.
 * Navigation is injected — pass `LinkComponent` (e.g. an adapter around your
 * router's Link) to keep client-side routing; it falls back to a plain <a>.
 */
import {
  createElement,
  useState,
  type ComponentType,
  type ReactNode,
  type FormEvent,
} from "react";
import { AuthStyles } from "./styles";

/** A router-agnostic link. Apps adapt their <Link to=…> to this href-based shape. */
export type LinkLike = ComponentType<{
  href: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}>;

export interface NavProps {
  /** Client-side link component; defaults to a plain <a>. */
  LinkComponent?: LinkLike;
}

function DefaultLink(props: { href: string; className?: string; children: ReactNode; "aria-label"?: string }) {
  return createElement("a", props);
}

export function AuthLink({
  href,
  className,
  children,
  LinkComponent,
  ...rest
}: { href: string; className?: string; children: ReactNode; "aria-label"?: string } & NavProps) {
  const C = LinkComponent ?? DefaultLink;
  return <C href={href} className={className} {...rest}>{children}</C>;
}

/* ── Icons (inline, 18px) ─────────────────────────────────────────────────── */
type IconProps = { size?: number };
const svg = (size: number, children: ReactNode) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {children}
  </svg>
);
export const MailIcon = ({ size = 18 }: IconProps) => svg(size, <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></>);
export const LockIcon = ({ size = 18 }: IconProps) => svg(size, <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>);
export const PhoneIcon = ({ size = 18 }: IconProps) => svg(size, <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />);
export const UserIcon = ({ size = 18 }: IconProps) => svg(size, <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>);
export const EyeIcon = ({ size = 18 }: IconProps) => svg(size, <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>);
export const EyeOffIcon = ({ size = 18 }: IconProps) => svg(size, <><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.53 13.53 0 0 0 2 11s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><path d="m2 2 20 20" /></>);
export const CheckIcon = ({ size = 12 }: IconProps) => svg(size, <path d="M20 6 9 17l-5-5" />);

/* ── Card shell ──────────────────────────────────────────────────────────── */
export interface AuthCardProps {
  /** Optional brand/logo rendered centered above the heading. */
  brand?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Force a theme; defaults to following the OS (prefers-color-scheme). */
  theme?: "light" | "dark";
  children: ReactNode;
  /** Optional trust badges row, e.g. ["Safe", "Credible", "Community driven"]. */
  badges?: string[];
}

export function AuthCard({ brand, title, subtitle, theme, children, badges }: AuthCardProps) {
  return (
    <div className="kpa-root" {...(theme ? { "data-kpa-theme": theme } : {})}>
      <AuthStyles />
      {(brand || title || subtitle) && (
        <div className="kpa-head">
          {brand && <div className="kpa-brand">{brand}</div>}
          {title && <h1 className="kpa-title">{title}</h1>}
          {subtitle && <p className="kpa-subtitle">{subtitle}</p>}
        </div>
      )}
      {children}
      {badges && badges.length > 0 && (
        <div className="kpa-badges">
          {badges.map((b, i) => (
            <span key={b} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {i > 0 && <span className="kpa-badge-dot" />}
              {b}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Fields ──────────────────────────────────────────────────────────────── */
export interface FieldProps {
  name: string;
  label?: ReactNode;
  labelExtra?: ReactNode;
  icon?: ReactNode;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
  readOnly?: boolean;
  minLength?: number;
  inputMode?: "text" | "numeric" | "tel" | "email";
}

export function Field({ name, label, labelExtra, icon, type = "text", ...input }: FieldProps) {
  return (
    <div className="kpa-field">
      {(label || labelExtra) && (
        <div className="kpa-field-row">
          {label && <label htmlFor={name} className="kpa-label">{label}</label>}
          {labelExtra}
        </div>
      )}
      <div className="kpa-input-wrap">
        {icon && <span className="kpa-input-icon">{icon}</span>}
        <input id={name} name={name} type={type} className="kpa-input"
          autoCapitalize="none" {...input} />
      </div>
    </div>
  );
}

export interface SelectFieldProps {
  name: string;
  label?: ReactNode;
  options: { value: string; label: string }[];
  defaultValue?: string;
  required?: boolean;
}

/** A labelled <select> styled to match Field — uncontrolled, read via FormData. */
export function SelectField({ name, label, options, defaultValue, required }: SelectFieldProps) {
  return (
    <div className="kpa-field">
      {label && <label htmlFor={name} className="kpa-label">{label}</label>}
      <div className="kpa-input-wrap">
        <select id={name} name={name} className="kpa-input" defaultValue={defaultValue} required={required}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export interface PasswordFieldProps {
  name?: string;
  label?: ReactNode;
  labelExtra?: ReactNode;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
  minLength?: number;
  pattern?: string;
  /** Controlled value — pass with `onValueChange` (needed for the strength meter). */
  value?: string;
  onValueChange?: (value: string) => void;
  /** Show a strength meter under the field (uses the controlled `value`). */
  strength?: boolean;
}

export function PasswordField({
  name = "password", label, labelExtra, autoComplete = "current-password",
  required = true, placeholder = "••••••••", minLength, pattern, value, onValueChange, strength,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);
  const controlled = value !== undefined && onValueChange !== undefined;
  return (
    <div className="kpa-field">
      {(label || labelExtra) && (
        <div className="kpa-field-row">
          {label && <label htmlFor={name} className="kpa-label">{label}</label>}
          {labelExtra}
        </div>
      )}
      <div className="kpa-input-wrap">
        <span className="kpa-input-icon"><LockIcon /></span>
        <input id={name} name={name} type={show ? "text" : "password"} className="kpa-input"
          autoComplete={autoComplete} required={required} placeholder={placeholder}
          minLength={minLength} pattern={pattern}
          {...(controlled ? { value, onChange: (e) => onValueChange!(e.target.value) } : {})} />
        <button type="button" className="kpa-input-btn" onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}>
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {strength && <PasswordStrengthMeter password={value ?? ""} />}
    </div>
  );
}

const STRENGTH = [
  { label: "Too weak", color: "#FF6B6B" },
  { label: "Weak", color: "#F59E0B" },
  { label: "Fair", color: "#EAB308" },
  { label: "Good", color: "#9742E7" },
  { label: "Strong", color: "#22C55E" },
];

/** 0–4 strength from length + character-class variety. Presentation only. */
export function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null;
  let met = 0;
  if (password.length >= 8) met++;
  if (/[a-z]/.test(password)) met++;
  if (/[A-Z]/.test(password)) met++;
  if (/\d/.test(password)) met++;
  if (/[^a-zA-Z\d]/.test(password)) met++;
  const score = Math.max(0, met - 1); // 0..4
  const { label, color } = STRENGTH[score];
  return (
    <div className="kpa-strength" style={{ ["--kpa-strength-color" as string]: color }}>
      <div className="kpa-strength-track">
        {[0, 1, 2, 3].map((i) => <span key={i} className="kpa-strength-seg" data-on={i <= score} />)}
      </div>
      <span className="kpa-strength-label">{label}</span>
    </div>
  );
}

export function Checkbox({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className="kpa-check" data-checked={checked} onClick={() => onChange(!checked)}>
      <span className="kpa-check-box">{checked && <CheckIcon />}</span>
      <span className="kpa-check-label">{children}</span>
    </label>
  );
}

export function SubmitButton({ pending, children, pendingLabel }: { pending?: boolean; children: ReactNode; pendingLabel?: ReactNode }) {
  return (
    <button type="submit" className="kpa-btn" disabled={pending}>
      {pending ? pendingLabel ?? children : children}
    </button>
  );
}

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return <div className="kpa-error"><p className="kpa-error-text">{message}</p></div>;
}

export function Divider({ label = "or" }: { label?: string }) {
  return (
    <div className="kpa-divider">
      <div className="kpa-divider-line" />
      <span className="kpa-divider-text">{label}</span>
      <div className="kpa-divider-line" />
    </div>
  );
}

/** Wraps children in a <form> whose submit reads the fields and calls onValues. */
export function AuthForm({ onSubmit, children }: { onSubmit: (data: FormData, e: FormEvent<HTMLFormElement>) => void; children: ReactNode }) {
  return (
    <form className="kpa-form" onSubmit={(e) => { e.preventDefault(); onSubmit(new FormData(e.currentTarget), e); }}>
      {children}
    </form>
  );
}

/* ── Status icons ────────────────────────────────────────────────────────── */
export const SpinnerIcon = ({ size = 28 }: IconProps) => (
  <svg className="kpa-spin" width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
export const CheckCircleIcon = ({ size = 30 }: IconProps) => svg(size, <><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>);
export const XCircleIcon = ({ size = 30 }: IconProps) => svg(size, <><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></>);

/* ── OTP / code input ────────────────────────────────────────────────────── */
export interface OtpFieldProps {
  name?: string;
  label?: ReactNode;
  length?: number;
  value?: string;
  onValueChange?: (value: string) => void;
  autoFocus?: boolean;
}

export function OtpField({ name = "otp", label, length = 6, value, onValueChange, autoFocus }: OtpFieldProps) {
  const controlled = value !== undefined && onValueChange !== undefined;
  return (
    <div className="kpa-field">
      {label && <label htmlFor={name} className="kpa-label">{label}</label>}
      <input
        id={name} name={name} className="kpa-otp" inputMode="numeric" autoComplete="one-time-code"
        maxLength={length} placeholder={"·".repeat(length)} autoFocus={autoFocus} required
        {...(controlled ? { value, onChange: (e) => onValueChange!(e.target.value.replace(/\D/g, "").slice(0, length)) } : {})}
      />
    </div>
  );
}

/* ── Status screen (sent / verifying / success / error) ──────────────────── */
export interface StatusScreenProps {
  variant?: "loading" | "success" | "error" | "info";
  /** Override the default variant icon. */
  icon?: ReactNode;
  title?: ReactNode;
  message?: ReactNode;
  /** Optional CTA row (buttons/links). */
  action?: ReactNode;
}

export function StatusScreen({ variant = "info", icon, title, message, action }: StatusScreenProps) {
  const defaultIcon =
    variant === "loading" ? <SpinnerIcon /> :
    variant === "success" ? <CheckCircleIcon /> :
    variant === "error" ? <XCircleIcon /> :
    <MailIcon size={28} />;
  return (
    <div className="kpa-status">
      <div className="kpa-status-icon" data-variant={variant}>{icon ?? defaultIcon}</div>
      {title && <h2 className="kpa-status-title">{title}</h2>}
      {message && <p className="kpa-status-msg">{message}</p>}
      {action}
    </div>
  );
}
