// src/ui/Login.tsx
import { useState as useState2 } from "react";

// src/ui/primitives.tsx
import {
  createElement as createElement2,
  useState
} from "react";

// src/ui/styles.ts
import { createElement } from "react";
var AUTH_STYLE_ID = "kinpay-auth-core-ui";
var AUTH_CSS = `
.kpa-root {
  /* Derive from the host app's design tokens (shadcn/Tailwind convention) so the
     shared surfaces wear the consuming app's \u2014 and its TENANT's \u2014 brand: circles
     injects the tenant's colour as --primary, so a lime tenant gets lime buttons.
     KinPay purple is only the fallback when a token is absent. The gradient
     collapses to the solid --primary unless the host defines its own from/to. */
  --kpa-bg: var(--card, #FFFFFF);
  --kpa-fg: var(--foreground, #1A0F2E);
  --kpa-primary: var(--primary, #9742E7);
  --kpa-primary-from: var(--kpa-gradient-from, var(--primary, #7732E8));
  --kpa-primary-to: var(--kpa-gradient-to, var(--primary, #B453E6));
  --kpa-primary-fg: var(--primary-foreground, #FFFFFF);
  --kpa-muted: var(--muted, #F2EFFE);
  --kpa-muted-fg: var(--muted-foreground, #9580B3);
  --kpa-border: var(--border, #ECE6F8);
  --kpa-field-bg: var(--input, #F7F5FE);
  --kpa-danger: var(--destructive, #FF6B6B);
  --kpa-radius: 16px;
  --kpa-radius-sm: 12px;
  --kpa-font: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;

  color: var(--kpa-fg);
  font-family: var(--kpa-font);
  -webkit-font-smoothing: antialiased;
  width: 100%;
  max-width: 24rem;
  box-sizing: border-box;
}
.kpa-root *, .kpa-root *::before, .kpa-root *::after { box-sizing: border-box; }

@media (prefers-color-scheme: dark) {
  .kpa-root:not([data-kpa-theme="light"]) {
    --kpa-bg: var(--card, #120A1E);
    --kpa-fg: var(--foreground, #F0EAFF);
    --kpa-primary: var(--primary, #B47BF0);
    --kpa-primary-from: var(--kpa-gradient-from, var(--primary, #9742E7));
    --kpa-primary-to: var(--kpa-gradient-to, var(--primary, #C96CF5));
    --kpa-muted: var(--muted, #261A3A);
    --kpa-muted-fg: var(--muted-foreground, #8B77A8);
    --kpa-border: var(--border, #2E2246);
    --kpa-field-bg: var(--input, #1B1030);
    --kpa-danger: var(--destructive, #FCA5A5);
  }
}
.kpa-root[data-kpa-theme="dark"] {
  --kpa-bg: var(--card, #120A1E);
  --kpa-fg: var(--foreground, #F0EAFF);
  --kpa-primary: var(--primary, #B47BF0);
  --kpa-primary-from: var(--kpa-gradient-from, var(--primary, #9742E7));
  --kpa-primary-to: var(--kpa-gradient-to, var(--primary, #C96CF5));
  --kpa-muted: var(--muted, #261A3A);
  --kpa-muted-fg: var(--muted-foreground, #8B77A8);
  --kpa-border: var(--border, #2E2246);
  --kpa-field-bg: var(--input, #1B1030);
  --kpa-danger: var(--destructive, #FCA5A5);
}

.kpa-head { text-align: center; margin-bottom: 2rem; }
.kpa-brand { display: flex; justify-content: center; margin-bottom: 1.5rem; }
.kpa-title { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 0.5rem; }
.kpa-subtitle { font-size: 0.875rem; font-weight: 500; line-height: 1.5; color: var(--kpa-muted-fg); margin: 0; }

.kpa-form { display: flex; flex-direction: column; gap: 1.25rem; }
.kpa-field { display: flex; flex-direction: column; gap: 0.375rem; }
.kpa-field-row { display: flex; justify-content: space-between; align-items: center; }
.kpa-label {
  font-size: 0.625rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.12em; color: var(--kpa-muted-fg);
}
.kpa-input-wrap { position: relative; display: flex; align-items: center; }
.kpa-input-icon { position: absolute; left: 0.875rem; display: flex; color: var(--kpa-muted-fg); pointer-events: none; }
.kpa-input {
  width: 100%; height: 3rem; padding: 0 0.875rem 0 2.5rem;
  background: var(--kpa-field-bg); color: var(--kpa-fg);
  border: 1px solid var(--kpa-border); border-radius: var(--kpa-radius);
  font-size: 0.9375rem; font-family: inherit; outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.kpa-input::placeholder { color: var(--kpa-muted-fg); opacity: 0.7; }
.kpa-input:focus { border-color: var(--kpa-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--kpa-primary) 18%, transparent); }
.kpa-input-btn {
  position: absolute; right: 0.5rem; background: none; border: none; cursor: pointer;
  color: var(--kpa-muted-fg); padding: 0.5rem; display: flex; border-radius: 8px;
}
.kpa-input-btn:hover { color: var(--kpa-fg); }

.kpa-link { color: var(--kpa-primary); font-weight: 700; text-decoration: none; cursor: pointer; }
.kpa-link:hover { text-decoration: underline; }
.kpa-link-sm { font-size: 0.625rem; text-transform: uppercase; letter-spacing: 0.12em; }

.kpa-check { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; width: fit-content; user-select: none; }
.kpa-check-box {
  width: 1.25rem; height: 1.25rem; border-radius: 999px; border: 2px solid var(--kpa-border);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; color: var(--kpa-primary-fg);
}
.kpa-check[data-checked="true"] .kpa-check-box { background: var(--kpa-primary); border-color: var(--kpa-primary); }
.kpa-check-label { font-size: 0.875rem; font-weight: 500; color: color-mix(in srgb, var(--kpa-fg) 70%, transparent); }

.kpa-btn {
  width: 100%; height: 3rem; border: none; border-radius: var(--kpa-radius); cursor: pointer;
  font-size: 0.9375rem; font-weight: 700; font-family: inherit; color: var(--kpa-primary-fg);
  background: linear-gradient(135deg, var(--kpa-primary-from), var(--kpa-primary-to));
  transition: opacity 0.15s, transform 0.05s; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
}
.kpa-btn:hover:not(:disabled) { opacity: 0.92; }
.kpa-btn:active:not(:disabled) { transform: scale(0.985); }
.kpa-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.kpa-btn-secondary {
  background: none; color: var(--kpa-fg); border: 1px solid var(--kpa-border);
  text-decoration: none; height: 2.75rem;
}
.kpa-btn-secondary:hover:not(:disabled) { background: var(--kpa-muted); opacity: 1; }

.kpa-error {
  margin-bottom: 1.25rem; padding: 0.75rem;
  background: color-mix(in srgb, var(--kpa-danger) 6%, transparent);
  border: 1px solid color-mix(in srgb, var(--kpa-danger) 22%, transparent);
  border-radius: var(--kpa-radius); text-align: center;
}
.kpa-error-text { font-size: 0.75rem; font-weight: 700; color: var(--kpa-danger); margin: 0; }

.kpa-divider { display: flex; align-items: center; gap: 0.75rem; margin: 1.5rem 0; }
.kpa-divider-line { flex: 1; height: 1px; background: var(--kpa-border); }
.kpa-divider-text { font-size: 0.75rem; font-weight: 600; color: var(--kpa-muted-fg); }

.kpa-alts { display: flex; flex-direction: column; gap: 0.75rem; }
.kpa-foot { margin-top: 1.5rem; text-align: center; font-size: 0.75rem; font-weight: 700; color: var(--kpa-muted-fg); }
.kpa-badges {
  margin-top: 2rem; display: flex; align-items: center; justify-content: center; gap: 1rem;
  font-size: 0.625rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.24em; color: color-mix(in srgb, var(--kpa-muted-fg) 60%, transparent);
}
.kpa-badge-dot { width: 3px; height: 3px; border-radius: 999px; background: currentColor; opacity: 0.5; }

.kpa-strength { display: flex; flex-direction: column; gap: 0.375rem; margin-top: 0.5rem; }
.kpa-strength-track { display: flex; gap: 0.25rem; }
.kpa-strength-seg { flex: 1; height: 4px; border-radius: 999px; background: var(--kpa-border); transition: background 0.2s; }
.kpa-strength-seg[data-on="true"] { background: var(--kpa-strength-color, var(--kpa-primary)); }
.kpa-strength-label { font-size: 0.6875rem; font-weight: 700; color: var(--kpa-strength-color, var(--kpa-muted-fg)); }

.kpa-otp {
  width: 100%; height: 3.25rem; text-align: center; letter-spacing: 0.5em; padding-left: 0.5em;
  font-size: 1.25rem; font-weight: 700; font-family: inherit;
  background: var(--kpa-field-bg); color: var(--kpa-fg);
  border: 1px solid var(--kpa-border); border-radius: var(--kpa-radius); outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.kpa-otp:focus { border-color: var(--kpa-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--kpa-primary) 18%, transparent); }

.kpa-status { text-align: center; padding: 0.5rem 0; display: flex; flex-direction: column; align-items: center; gap: 0.875rem; }
.kpa-status-icon { width: 3.5rem; height: 3.5rem; border-radius: 999px; display: flex; align-items: center; justify-content: center; }
.kpa-status-icon[data-variant="loading"] { color: var(--kpa-primary); }
.kpa-status-icon[data-variant="success"] { background: color-mix(in srgb, #22C55E 12%, transparent); color: #22C55E; }
.kpa-status-icon[data-variant="error"] { background: color-mix(in srgb, var(--kpa-danger) 12%, transparent); color: var(--kpa-danger); }
.kpa-status-icon[data-variant="info"] { background: var(--kpa-muted); color: var(--kpa-primary); }
.kpa-status-title { font-size: 1.125rem; font-weight: 800; letter-spacing: -0.01em; margin: 0; }
.kpa-status-msg { font-size: 0.875rem; color: var(--kpa-muted-fg); margin: 0; line-height: 1.5; }
.kpa-status-msg strong { color: var(--kpa-fg); font-weight: 700; }
.kpa-spin { animation: kpa-spin 0.8s linear infinite; }
@keyframes kpa-spin { to { transform: rotate(360deg); } }
`;
function AuthStyles() {
  return createElement("style", { href: AUTH_STYLE_ID, precedence: "default", children: AUTH_CSS });
}

// src/ui/primitives.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function DefaultLink(props) {
  return createElement2("a", props);
}
function AuthLink({
  href,
  className,
  children,
  LinkComponent,
  ...rest
}) {
  const C = LinkComponent ?? DefaultLink;
  return /* @__PURE__ */ jsx(C, { href, className, ...rest, children });
}
var svg = (size, children) => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    children
  }
);
var MailIcon = ({ size = 18 }) => svg(size, /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx("rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }),
  /* @__PURE__ */ jsx("path", { d: "m22 7-10 5L2 7" })
] }));
var LockIcon = ({ size = 18 }) => svg(size, /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2" }),
  /* @__PURE__ */ jsx("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
] }));
var PhoneIcon = ({ size = 18 }) => svg(size, /* @__PURE__ */ jsx("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" }));
var UserIcon = ({ size = 18 }) => svg(size, /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx("path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }),
  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "7", r: "4" })
] }));
var EyeIcon = ({ size = 18 }) => svg(size, /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx("path", { d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" }),
  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3" })
] }));
var EyeOffIcon = ({ size = 18 }) => svg(size, /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx("path", { d: "M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" }),
  /* @__PURE__ */ jsx("path", { d: "M6.61 6.61A13.53 13.53 0 0 0 2 11s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61" }),
  /* @__PURE__ */ jsx("path", { d: "m2 2 20 20" })
] }));
var CheckIcon = ({ size = 12 }) => svg(size, /* @__PURE__ */ jsx("path", { d: "M20 6 9 17l-5-5" }));
function AuthCard({ brand, title, subtitle, theme, children, badges }) {
  return /* @__PURE__ */ jsxs("div", { className: "kpa-root", ...theme ? { "data-kpa-theme": theme } : {}, children: [
    /* @__PURE__ */ jsx(AuthStyles, {}),
    (brand || title || subtitle) && /* @__PURE__ */ jsxs("div", { className: "kpa-head", children: [
      brand && /* @__PURE__ */ jsx("div", { className: "kpa-brand", children: brand }),
      title && /* @__PURE__ */ jsx("h1", { className: "kpa-title", children: title }),
      subtitle && /* @__PURE__ */ jsx("p", { className: "kpa-subtitle", children: subtitle })
    ] }),
    children,
    badges && badges.length > 0 && /* @__PURE__ */ jsx("div", { className: "kpa-badges", children: badges.map((b, i) => /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "1rem" }, children: [
      i > 0 && /* @__PURE__ */ jsx("span", { className: "kpa-badge-dot" }),
      b
    ] }, b)) })
  ] });
}
function Field({ name, label, labelExtra, icon, type = "text", ...input }) {
  return /* @__PURE__ */ jsxs("div", { className: "kpa-field", children: [
    (label || labelExtra) && /* @__PURE__ */ jsxs("div", { className: "kpa-field-row", children: [
      label && /* @__PURE__ */ jsx("label", { htmlFor: name, className: "kpa-label", children: label }),
      labelExtra
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "kpa-input-wrap", children: [
      icon && /* @__PURE__ */ jsx("span", { className: "kpa-input-icon", children: icon }),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: name,
          name,
          type,
          className: "kpa-input",
          autoCapitalize: "none",
          ...input
        }
      )
    ] })
  ] });
}
function SelectField({ name, label, options, defaultValue, required }) {
  return /* @__PURE__ */ jsxs("div", { className: "kpa-field", children: [
    label && /* @__PURE__ */ jsx("label", { htmlFor: name, className: "kpa-label", children: label }),
    /* @__PURE__ */ jsx("div", { className: "kpa-input-wrap", children: /* @__PURE__ */ jsx("select", { id: name, name, className: "kpa-input", defaultValue, required, children: options.map((o) => /* @__PURE__ */ jsx("option", { value: o.value, children: o.label }, o.value)) }) })
  ] });
}
function PasswordField({
  name = "password",
  label,
  labelExtra,
  autoComplete = "current-password",
  required = true,
  placeholder = "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
  minLength,
  pattern,
  value,
  onValueChange,
  strength
}) {
  const [show, setShow] = useState(false);
  const controlled = value !== void 0 && onValueChange !== void 0;
  return /* @__PURE__ */ jsxs("div", { className: "kpa-field", children: [
    (label || labelExtra) && /* @__PURE__ */ jsxs("div", { className: "kpa-field-row", children: [
      label && /* @__PURE__ */ jsx("label", { htmlFor: name, className: "kpa-label", children: label }),
      labelExtra
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "kpa-input-wrap", children: [
      /* @__PURE__ */ jsx("span", { className: "kpa-input-icon", children: /* @__PURE__ */ jsx(LockIcon, {}) }),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: name,
          name,
          type: show ? "text" : "password",
          className: "kpa-input",
          autoComplete,
          required,
          placeholder,
          minLength,
          pattern,
          ...controlled ? { value, onChange: (e) => onValueChange(e.target.value) } : {}
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "kpa-input-btn",
          onClick: () => setShow((s) => !s),
          "aria-label": show ? "Hide password" : "Show password",
          children: show ? /* @__PURE__ */ jsx(EyeOffIcon, {}) : /* @__PURE__ */ jsx(EyeIcon, {})
        }
      )
    ] }),
    strength && /* @__PURE__ */ jsx(PasswordStrengthMeter, { password: value ?? "" })
  ] });
}
var STRENGTH = [
  { label: "Too weak", color: "#FF6B6B" },
  { label: "Weak", color: "#F59E0B" },
  { label: "Fair", color: "#EAB308" },
  { label: "Good", color: "#9742E7" },
  { label: "Strong", color: "#22C55E" }
];
function PasswordStrengthMeter({ password }) {
  if (!password) return null;
  let met = 0;
  if (password.length >= 8) met++;
  if (/[a-z]/.test(password)) met++;
  if (/[A-Z]/.test(password)) met++;
  if (/\d/.test(password)) met++;
  if (/[^a-zA-Z\d]/.test(password)) met++;
  const score = Math.max(0, met - 1);
  const { label, color } = STRENGTH[score];
  return /* @__PURE__ */ jsxs("div", { className: "kpa-strength", style: { ["--kpa-strength-color"]: color }, children: [
    /* @__PURE__ */ jsx("div", { className: "kpa-strength-track", children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsx("span", { className: "kpa-strength-seg", "data-on": i <= score }, i)) }),
    /* @__PURE__ */ jsx("span", { className: "kpa-strength-label", children: label })
  ] });
}
function Checkbox({ checked, onChange, children }) {
  return /* @__PURE__ */ jsxs("label", { className: "kpa-check", "data-checked": checked, onClick: () => onChange(!checked), children: [
    /* @__PURE__ */ jsx("span", { className: "kpa-check-box", children: checked && /* @__PURE__ */ jsx(CheckIcon, {}) }),
    /* @__PURE__ */ jsx("span", { className: "kpa-check-label", children })
  ] });
}
function SubmitButton({ pending, children, pendingLabel }) {
  return /* @__PURE__ */ jsx("button", { type: "submit", className: "kpa-btn", disabled: pending, children: pending ? pendingLabel ?? children : children });
}
function FormError({ message }) {
  if (!message) return null;
  return /* @__PURE__ */ jsx("div", { className: "kpa-error", children: /* @__PURE__ */ jsx("p", { className: "kpa-error-text", children: message }) });
}
function Divider({ label = "or" }) {
  return /* @__PURE__ */ jsxs("div", { className: "kpa-divider", children: [
    /* @__PURE__ */ jsx("div", { className: "kpa-divider-line" }),
    /* @__PURE__ */ jsx("span", { className: "kpa-divider-text", children: label }),
    /* @__PURE__ */ jsx("div", { className: "kpa-divider-line" })
  ] });
}
function AuthForm({ onSubmit, children }) {
  return /* @__PURE__ */ jsx("form", { className: "kpa-form", onSubmit: (e) => {
    e.preventDefault();
    onSubmit(new FormData(e.currentTarget), e);
  }, children });
}
var SpinnerIcon = ({ size = 28 }) => /* @__PURE__ */ jsxs("svg", { className: "kpa-spin", width: size, height: size, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true, children: [
  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9", stroke: "currentColor", strokeWidth: "3", strokeOpacity: "0.2" }),
  /* @__PURE__ */ jsx("path", { d: "M21 12a9 9 0 0 0-9-9", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round" })
] });
var CheckCircleIcon = ({ size = 30 }) => svg(size, /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ jsx("path", { d: "m9 12 2 2 4-4" })
] }));
var XCircleIcon = ({ size = 30 }) => svg(size, /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ jsx("path", { d: "m15 9-6 6" }),
  /* @__PURE__ */ jsx("path", { d: "m9 9 6 6" })
] }));
function OtpField({ name = "otp", label, length = 6, value, onValueChange, autoFocus }) {
  const controlled = value !== void 0 && onValueChange !== void 0;
  return /* @__PURE__ */ jsxs("div", { className: "kpa-field", children: [
    label && /* @__PURE__ */ jsx("label", { htmlFor: name, className: "kpa-label", children: label }),
    /* @__PURE__ */ jsx(
      "input",
      {
        id: name,
        name,
        className: "kpa-otp",
        inputMode: "numeric",
        autoComplete: "one-time-code",
        maxLength: length,
        placeholder: "\xB7".repeat(length),
        autoFocus,
        required: true,
        ...controlled ? { value, onChange: (e) => onValueChange(e.target.value.replace(/\D/g, "").slice(0, length)) } : {}
      }
    )
  ] });
}
function StatusScreen({ variant = "info", icon, title, message, action }) {
  const defaultIcon = variant === "loading" ? /* @__PURE__ */ jsx(SpinnerIcon, {}) : variant === "success" ? /* @__PURE__ */ jsx(CheckCircleIcon, {}) : variant === "error" ? /* @__PURE__ */ jsx(XCircleIcon, {}) : /* @__PURE__ */ jsx(MailIcon, { size: 28 });
  return /* @__PURE__ */ jsxs("div", { className: "kpa-status", children: [
    /* @__PURE__ */ jsx("div", { className: "kpa-status-icon", "data-variant": variant, children: icon ?? defaultIcon }),
    title && /* @__PURE__ */ jsx("h2", { className: "kpa-status-title", children: title }),
    message && /* @__PURE__ */ jsx("p", { className: "kpa-status-msg", children: message }),
    action
  ] });
}

// src/ui/Login.tsx
import { Fragment as Fragment2, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function Login({
  onSubmit,
  error,
  pending,
  brand,
  title = "Welcome back!",
  subtitle = "The simplest way to structure loans between people who trust each other",
  theme,
  badges,
  identifierLabel = "Phone number or Email",
  identifierPlaceholder = "e.g. +47 900 00 000",
  registerHref,
  forgotPasswordHref,
  magicLinkHref,
  showStaySignedIn = true,
  LinkComponent
}) {
  const [staySignedIn, setStaySignedIn] = useState2(false);
  return /* @__PURE__ */ jsxs2(AuthCard, { brand, title, subtitle, theme, badges, children: [
    /* @__PURE__ */ jsx2(FormError, { message: error }),
    /* @__PURE__ */ jsxs2(AuthForm, { onSubmit: (data) => onSubmit({
      identifier: String(data.get("identifier") ?? ""),
      password: String(data.get("password") ?? ""),
      staySignedIn
    }), children: [
      /* @__PURE__ */ jsx2(
        Field,
        {
          name: "identifier",
          label: identifierLabel,
          icon: /* @__PURE__ */ jsx2(MailIcon, {}),
          autoComplete: "username",
          placeholder: identifierPlaceholder,
          required: true
        }
      ),
      /* @__PURE__ */ jsx2(
        PasswordField,
        {
          label: "Password",
          labelExtra: forgotPasswordHref ? /* @__PURE__ */ jsx2(AuthLink, { href: forgotPasswordHref, className: "kpa-link kpa-link-sm", LinkComponent, children: "Forgot password?" }) : void 0
        }
      ),
      showStaySignedIn && /* @__PURE__ */ jsx2(Checkbox, { checked: staySignedIn, onChange: setStaySignedIn, children: "Stay signed in for 30 days" }),
      /* @__PURE__ */ jsx2(SubmitButton, { pending, pendingLabel: "Signing in\u2026", children: "Sign In" })
    ] }),
    registerHref && /* @__PURE__ */ jsxs2("div", { className: "kpa-foot", children: [
      "New to KinPay?",
      " ",
      /* @__PURE__ */ jsx2(AuthLink, { href: registerHref, className: "kpa-link", LinkComponent, children: "Create an Account" })
    ] }),
    magicLinkHref && /* @__PURE__ */ jsxs2(Fragment2, { children: [
      /* @__PURE__ */ jsx2(Divider, {}),
      /* @__PURE__ */ jsx2("div", { className: "kpa-alts", children: /* @__PURE__ */ jsxs2(
        AuthLink,
        {
          href: magicLinkHref,
          className: "kpa-btn kpa-btn-secondary",
          "aria-label": "Email me a sign-in link",
          LinkComponent,
          children: [
            /* @__PURE__ */ jsx2(MailIcon, { size: 16 }),
            "Email me a sign-in link"
          ]
        }
      ) })
    ] })
  ] });
}

// src/ui/Register.tsx
import { useState as useState3 } from "react";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var PASSWORD_PATTERN = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,}$";
var DEFAULT_LABELS = {
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
  submitting: "Creating account\u2026",
  haveAccount: "Already have an account?",
  signIn: "Sign In"
};
function Register({
  onSubmit,
  error,
  pending,
  brand,
  theme,
  badges,
  notice,
  whatsappEnabled = false,
  defaults,
  emailLocked,
  loginHref,
  labels,
  LinkComponent
}) {
  const t = { ...DEFAULT_LABELS, ...labels };
  const [password, setPassword] = useState3(defaults?.password ?? "");
  return /* @__PURE__ */ jsxs3(AuthCard, { brand, title: t.title, subtitle: t.subtitle, theme, badges, children: [
    notice,
    /* @__PURE__ */ jsx3(FormError, { message: error }),
    /* @__PURE__ */ jsxs3(AuthForm, { onSubmit: (data) => onSubmit({
      fullName: String(data.get("fullName") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? "") || void 0,
      password
    }), children: [
      /* @__PURE__ */ jsx3(
        Field,
        {
          name: "fullName",
          label: t.fullName,
          icon: /* @__PURE__ */ jsx3(UserIcon, {}),
          autoComplete: "name",
          placeholder: t.fullNamePlaceholder,
          required: true,
          defaultValue: defaults?.fullName
        }
      ),
      /* @__PURE__ */ jsx3(
        Field,
        {
          name: "email",
          type: "email",
          label: t.email,
          icon: /* @__PURE__ */ jsx3(MailIcon, {}),
          autoComplete: "email",
          placeholder: t.emailPlaceholder,
          required: true,
          defaultValue: defaults?.email,
          ...emailLocked ? { readOnly: true } : {}
        }
      ),
      /* @__PURE__ */ jsx3(
        Field,
        {
          name: "phone",
          type: "tel",
          icon: /* @__PURE__ */ jsx3(PhoneIcon, {}),
          label: whatsappEnabled ? t.phone : t.phoneOptional,
          autoComplete: "tel",
          placeholder: t.phonePlaceholder,
          required: whatsappEnabled,
          defaultValue: defaults?.phone
        }
      ),
      /* @__PURE__ */ jsx3(
        PasswordField,
        {
          label: t.password,
          autoComplete: "new-password",
          minLength: 8,
          pattern: PASSWORD_PATTERN,
          value: password,
          onValueChange: setPassword,
          strength: true
        }
      ),
      /* @__PURE__ */ jsx3(SubmitButton, { pending, pendingLabel: t.submitting, children: t.submit })
    ] }),
    loginHref && /* @__PURE__ */ jsxs3("div", { className: "kpa-foot", children: [
      t.haveAccount,
      " ",
      /* @__PURE__ */ jsx3(AuthLink, { href: loginHref, className: "kpa-link", LinkComponent, children: t.signIn })
    ] })
  ] });
}

// src/ui/MagicLinkRequest.tsx
import { useState as useState4 } from "react";
import { Fragment as Fragment3, jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var DEFAULT_LABELS2 = {
  title: "Sign in with email",
  subtitle: "Enter your email and we'll send you a link that signs you in instantly \u2014 no password needed.",
  identifier: "Email address",
  identifierPlaceholder: "your@email.com",
  submit: "Send login link",
  submitting: "Sending\u2026",
  /** Confirmation heading once the link is sent. */
  sentTitle: "Check your email",
  /** Message wraps the identifier: `{before} <strong>X</strong>. {after}` */
  sentMessageBefore: "We sent a login link to",
  sentMessageAfter: "It expires in 15 minutes.",
  backToLogin: "Back to Sign In",
  useDifferent: "Use a different email"
};
function MagicLinkRequest({
  onSubmit,
  error,
  pending,
  brand,
  theme,
  badges,
  backToLoginHref,
  labels,
  LinkComponent
}) {
  const t = { ...DEFAULT_LABELS2, ...labels };
  const [sentTo, setSentTo] = useState4(null);
  const [submitting, setSubmitting] = useState4(false);
  async function handleSubmit(identifier) {
    setSubmitting(true);
    try {
      await onSubmit(identifier);
      setSentTo(identifier);
    } finally {
      setSubmitting(false);
    }
  }
  if (sentTo) {
    return /* @__PURE__ */ jsx4(AuthCard, { brand, theme, badges, children: /* @__PURE__ */ jsx4(
      StatusScreen,
      {
        variant: "success",
        title: t.sentTitle,
        message: /* @__PURE__ */ jsxs4(Fragment3, { children: [
          t.sentMessageBefore,
          " ",
          /* @__PURE__ */ jsx4("strong", { children: sentTo }),
          ". ",
          t.sentMessageAfter
        ] }),
        action: /* @__PURE__ */ jsxs4("div", { className: "kpa-alts", children: [
          backToLoginHref && /* @__PURE__ */ jsx4(
            AuthLink,
            {
              href: backToLoginHref,
              className: "kpa-btn",
              LinkComponent,
              children: t.backToLogin
            }
          ),
          /* @__PURE__ */ jsx4(
            "button",
            {
              type: "button",
              className: "kpa-btn kpa-btn-secondary",
              onClick: () => setSentTo(null),
              children: t.useDifferent
            }
          )
        ] })
      }
    ) });
  }
  return /* @__PURE__ */ jsxs4(AuthCard, { brand, title: t.title, subtitle: t.subtitle, theme, badges, children: [
    /* @__PURE__ */ jsx4(FormError, { message: error }),
    /* @__PURE__ */ jsxs4(AuthForm, { onSubmit: (data) => handleSubmit(String(data.get("identifier") ?? "")), children: [
      /* @__PURE__ */ jsx4(
        Field,
        {
          name: "identifier",
          type: "email",
          label: t.identifier,
          icon: /* @__PURE__ */ jsx4(MailIcon, {}),
          autoComplete: "email",
          placeholder: t.identifierPlaceholder,
          required: true
        }
      ),
      /* @__PURE__ */ jsx4(SubmitButton, { pending: pending || submitting, pendingLabel: t.submitting, children: t.submit })
    ] }),
    backToLoginHref && /* @__PURE__ */ jsx4("div", { className: "kpa-foot", children: /* @__PURE__ */ jsx4(AuthLink, { href: backToLoginHref, className: "kpa-link", LinkComponent, children: t.backToLogin }) })
  ] });
}

// src/ui/MagicLinkCallback.tsx
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
var DEFAULT_LABELS3 = {
  loadingTitle: "Signing you in\u2026",
  loadingMessage: "Just a moment",
  successTitle: "You're signed in",
  successMessage: "Your sign-in link has been verified.",
  continue: "Continue",
  errorTitle: "Link expired or already used",
  errorMessage: "Something went wrong. Please request a new link.",
  retry: "Back to sign in"
};
function MagicLinkCallback({
  status,
  errorMessage,
  continueHref,
  retryHref,
  brand,
  theme,
  labels,
  LinkComponent
}) {
  const t = { ...DEFAULT_LABELS3, ...labels };
  return /* @__PURE__ */ jsxs5(AuthCard, { brand, theme, children: [
    status === "loading" && /* @__PURE__ */ jsx5(
      StatusScreen,
      {
        variant: "loading",
        title: t.loadingTitle,
        message: t.loadingMessage
      }
    ),
    status === "success" && /* @__PURE__ */ jsx5(
      StatusScreen,
      {
        variant: "success",
        title: t.successTitle,
        message: t.successMessage,
        action: continueHref ? /* @__PURE__ */ jsx5("div", { className: "kpa-alts", children: /* @__PURE__ */ jsx5(
          AuthLink,
          {
            href: continueHref,
            className: "kpa-btn kpa-btn-secondary",
            LinkComponent,
            children: t.continue
          }
        ) }) : void 0
      }
    ),
    status === "error" && /* @__PURE__ */ jsx5(
      StatusScreen,
      {
        variant: "error",
        title: t.errorTitle,
        message: errorMessage ?? t.errorMessage,
        action: retryHref ? /* @__PURE__ */ jsx5("div", { className: "kpa-alts", children: /* @__PURE__ */ jsx5(
          AuthLink,
          {
            href: retryHref,
            className: "kpa-btn kpa-btn-secondary",
            LinkComponent,
            children: t.retry
          }
        ) }) : void 0
      }
    )
  ] });
}

// src/ui/Claim.tsx
import { useState as useState5 } from "react";
import { jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
var PASSWORD_PATTERN2 = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,}$";
var DEFAULT_LABELS4 = {
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
  sending: "Sending\u2026",
  otp: "Verification code",
  password: "Choose a password",
  submit: "Claim & sign in",
  submitting: "Setting up\u2026",
  changeIdentifier: "Use a different phone or email",
  changeIdentifierEmailOnly: "Use a different email",
  haveAccount: "Already set up your account?",
  signIn: "Sign in"
};
function Claim({
  onRequestCode,
  onVerify,
  error,
  pending,
  whatsappEnabled = false,
  brand,
  theme,
  badges,
  backToLoginHref,
  labels,
  LinkComponent
}) {
  const t = { ...DEFAULT_LABELS4, ...labels };
  const [step, setStep] = useState5("identifier");
  const [identifier, setIdentifier] = useState5("");
  const [password, setPassword] = useState5("");
  async function requestCode(value) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setIdentifier(trimmed);
    try {
      await onRequestCode(trimmed);
      setStep("verify");
    } catch {
    }
  }
  const subtitle = step === "identifier" ? whatsappEnabled ? t.subtitleIdentifier : t.subtitleIdentifierEmailOnly : t.subtitleVerify.replace("{identifier}", identifier);
  return /* @__PURE__ */ jsxs6(AuthCard, { brand, title: t.title, subtitle, theme, badges, children: [
    /* @__PURE__ */ jsx6(FormError, { message: error }),
    step === "identifier" ? /* @__PURE__ */ jsxs6(AuthForm, { onSubmit: (data) => requestCode(String(data.get("identifier") ?? "")), children: [
      /* @__PURE__ */ jsx6(
        Field,
        {
          name: "identifier",
          type: whatsappEnabled ? "text" : "email",
          inputMode: whatsappEnabled ? "text" : "email",
          label: whatsappEnabled ? t.identifierPhoneOrEmail : t.identifierEmail,
          placeholder: whatsappEnabled ? t.identifierPhoneOrEmailPlaceholder : t.identifierEmailPlaceholder,
          icon: /* @__PURE__ */ jsx6(MailIcon, {}),
          autoComplete: "username",
          required: true
        }
      ),
      /* @__PURE__ */ jsx6(SubmitButton, { pending, pendingLabel: t.sending, children: t.sendCode })
    ] }) : /* @__PURE__ */ jsxs6(AuthForm, { onSubmit: (data) => onVerify({
      otp: String(data.get("otp") ?? "").trim(),
      password
    }), children: [
      /* @__PURE__ */ jsx6(OtpField, { label: t.otp, autoFocus: true }),
      /* @__PURE__ */ jsx6(
        PasswordField,
        {
          label: t.password,
          autoComplete: "new-password",
          minLength: 8,
          pattern: PASSWORD_PATTERN2,
          value: password,
          onValueChange: setPassword,
          strength: true
        }
      ),
      /* @__PURE__ */ jsx6(SubmitButton, { pending, pendingLabel: t.submitting, children: t.submit }),
      /* @__PURE__ */ jsx6("div", { className: "kpa-foot", children: /* @__PURE__ */ jsx6(
        "button",
        {
          type: "button",
          className: "kpa-link",
          onClick: () => setStep("identifier"),
          children: whatsappEnabled ? t.changeIdentifier : t.changeIdentifierEmailOnly
        }
      ) })
    ] }),
    backToLoginHref && /* @__PURE__ */ jsxs6("div", { className: "kpa-foot", children: [
      t.haveAccount,
      " ",
      /* @__PURE__ */ jsx6(AuthLink, { href: backToLoginHref, className: "kpa-link", LinkComponent, children: t.signIn })
    ] })
  ] });
}

// src/ui/ForgotPassword.tsx
import { useState as useState6 } from "react";
import { Fragment as Fragment4, jsx as jsx7, jsxs as jsxs7 } from "react/jsx-runtime";
var PASSWORD_PATTERN3 = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,}$";
var DEFAULT_LABELS5 = {
  // email step
  emailTitle: "Reset your password",
  emailSubtitle: "Enter your email and we'll send a reset code",
  email: "Email Address",
  emailPlaceholder: "you@example.com",
  requestSubmit: "Send Reset Code",
  requesting: "Sending\u2026",
  // otp step
  otpTitle: "Check your email",
  otpSubtitle: "We sent a reset code to",
  otp: "Verification Code",
  verifySubmit: "Verify Code",
  verifying: "Verifying\u2026",
  // new-password step
  passwordTitle: "Set new password",
  passwordSubtitle: "Choose a strong password for your account",
  password: "New Password",
  passwordSubmit: "Reset Password",
  settingPassword: "Resetting\u2026",
  // done step
  doneTitle: "Password reset",
  doneMessage: "Your password has been updated. You can now sign in.",
  // shared
  backToLogin: "Back to Sign In",
  signIn: "Sign In",
  magicLink: "Email me a sign-in link instead"
};
function ForgotPassword({
  onRequestReset,
  onVerifyCode,
  onSetPassword,
  error,
  pending,
  brand,
  theme,
  badges,
  backToLoginHref,
  magicLinkHref,
  labels,
  LinkComponent
}) {
  const t = { ...DEFAULT_LABELS5, ...labels };
  const [step, setStep] = useState6("email");
  const [email, setEmail] = useState6("");
  const [password, setPassword] = useState6("");
  const [busy, setBusy] = useState6(false);
  const isPending = pending || busy;
  const run = async (fn, next) => {
    setBusy(true);
    try {
      await fn();
      setStep(next);
    } finally {
      setBusy(false);
    }
  };
  const backLink = backToLoginHref ? /* @__PURE__ */ jsx7("div", { className: "kpa-foot", children: /* @__PURE__ */ jsx7(AuthLink, { href: backToLoginHref, className: "kpa-link", LinkComponent, children: t.backToLogin }) }) : null;
  if (step === "done") {
    return /* @__PURE__ */ jsx7(AuthCard, { brand, theme, badges, children: /* @__PURE__ */ jsx7(
      StatusScreen,
      {
        variant: "success",
        title: t.doneTitle,
        message: t.doneMessage,
        action: backToLoginHref ? /* @__PURE__ */ jsx7(AuthLink, { href: backToLoginHref, className: "kpa-btn", LinkComponent, children: t.signIn }) : void 0
      }
    ) });
  }
  if (step === "new-password") {
    return /* @__PURE__ */ jsxs7(AuthCard, { brand, title: t.passwordTitle, subtitle: t.passwordSubtitle, theme, badges, children: [
      /* @__PURE__ */ jsx7(FormError, { message: error }),
      /* @__PURE__ */ jsxs7(AuthForm, { onSubmit: () => run(() => onSetPassword(password), "done"), children: [
        /* @__PURE__ */ jsx7(
          PasswordField,
          {
            label: t.password,
            autoComplete: "new-password",
            minLength: 8,
            pattern: PASSWORD_PATTERN3,
            value: password,
            onValueChange: setPassword,
            strength: true
          }
        ),
        /* @__PURE__ */ jsx7(SubmitButton, { pending: isPending, pendingLabel: t.settingPassword, children: t.passwordSubmit })
      ] }),
      backLink
    ] });
  }
  if (step === "otp") {
    return /* @__PURE__ */ jsxs7(
      AuthCard,
      {
        brand,
        title: t.otpTitle,
        theme,
        badges,
        subtitle: /* @__PURE__ */ jsxs7(Fragment4, { children: [
          t.otpSubtitle,
          /* @__PURE__ */ jsx7("br", {}),
          /* @__PURE__ */ jsx7("strong", { children: email })
        ] }),
        children: [
          /* @__PURE__ */ jsx7(FormError, { message: error }),
          /* @__PURE__ */ jsxs7(AuthForm, { onSubmit: (data) => run(() => onVerifyCode(String(data.get("otp") ?? "")), "new-password"), children: [
            /* @__PURE__ */ jsx7(OtpField, { label: t.otp, autoFocus: true }),
            /* @__PURE__ */ jsx7(SubmitButton, { pending: isPending, pendingLabel: t.verifying, children: t.verifySubmit })
          ] }),
          backLink
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs7(AuthCard, { brand, title: t.emailTitle, subtitle: t.emailSubtitle, theme, badges, children: [
    /* @__PURE__ */ jsx7(FormError, { message: error }),
    /* @__PURE__ */ jsxs7(AuthForm, { onSubmit: (data) => {
      const value = String(data.get("email") ?? "");
      setEmail(value);
      run(() => onRequestReset(value), "otp");
    }, children: [
      /* @__PURE__ */ jsx7(
        Field,
        {
          name: "email",
          type: "email",
          label: t.email,
          icon: /* @__PURE__ */ jsx7(MailIcon, {}),
          autoComplete: "email",
          placeholder: t.emailPlaceholder,
          required: true
        }
      ),
      /* @__PURE__ */ jsx7(SubmitButton, { pending: isPending, pendingLabel: t.requesting, children: t.requestSubmit })
    ] }),
    magicLinkHref && /* @__PURE__ */ jsxs7(Fragment4, { children: [
      /* @__PURE__ */ jsx7(Divider, {}),
      /* @__PURE__ */ jsx7("div", { className: "kpa-alts", children: /* @__PURE__ */ jsxs7(
        AuthLink,
        {
          href: magicLinkHref,
          className: "kpa-btn kpa-btn-secondary",
          "aria-label": t.magicLink,
          LinkComponent,
          children: [
            /* @__PURE__ */ jsx7(MailIcon, { size: 16 }),
            t.magicLink
          ]
        }
      ) })
    ] }),
    backLink
  ] });
}

// src/ui/ProfileForm.tsx
import { jsx as jsx8, jsxs as jsxs8 } from "react/jsx-runtime";
var DEFAULT_LANGUAGES = [
  { value: "en", label: "English" },
  { value: "sw", label: "Kiswahili" }
];
var DEFAULT_CURRENCIES = [
  { value: "ZMW", label: "ZMW \u2014 Zambian Kwacha" },
  { value: "USD", label: "USD \u2014 US Dollar" }
];
function ProfileForm({
  initial = {},
  onSubmit,
  error,
  pending,
  languageOptions = DEFAULT_LANGUAGES,
  currencyOptions = DEFAULT_CURRENCIES,
  brand,
  title = "Your details",
  subtitle = "Update your personal information.",
  theme,
  submitLabel = "Save changes",
  labels = {}
}) {
  const l = {
    fullName: "Full name",
    phone: "Phone number",
    email: "Email",
    language: "Language",
    currency: "Currency",
    dob: "Date of birth",
    address: "Street address",
    country: "Country of residence",
    ...labels
  };
  return /* @__PURE__ */ jsxs8(AuthCard, { brand, title, subtitle, theme, children: [
    /* @__PURE__ */ jsx8(AuthStyles, {}),
    /* @__PURE__ */ jsx8(FormError, { message: error }),
    /* @__PURE__ */ jsxs8(AuthForm, { onSubmit: (data) => onSubmit({
      full_name: String(data.get("full_name") ?? "").trim(),
      phone_number: String(data.get("phone_number") ?? "").trim(),
      preferred_language: String(data.get("preferred_language") ?? ""),
      preferred_currency: String(data.get("preferred_currency") ?? ""),
      date_of_birth: String(data.get("date_of_birth") ?? ""),
      street_address: String(data.get("street_address") ?? "").trim(),
      country_of_residence: String(data.get("country_of_residence") ?? "").trim()
    }), children: [
      /* @__PURE__ */ jsx8(
        Field,
        {
          name: "full_name",
          label: l.fullName,
          icon: /* @__PURE__ */ jsx8(UserIcon, {}),
          defaultValue: initial.full_name ?? "",
          autoComplete: "name",
          required: true
        }
      ),
      /* @__PURE__ */ jsx8(
        Field,
        {
          name: "phone_number",
          label: l.phone,
          icon: /* @__PURE__ */ jsx8(PhoneIcon, {}),
          type: "tel",
          inputMode: "tel",
          defaultValue: initial.phone_number ?? "",
          autoComplete: "tel"
        }
      ),
      initial.email != null && /* @__PURE__ */ jsx8(
        Field,
        {
          name: "email_display",
          label: l.email,
          defaultValue: initial.email ?? "",
          readOnly: true,
          autoComplete: "email"
        }
      ),
      /* @__PURE__ */ jsx8(
        SelectField,
        {
          name: "preferred_language",
          label: l.language,
          options: languageOptions,
          defaultValue: initial.preferred_language
        }
      ),
      /* @__PURE__ */ jsx8(
        SelectField,
        {
          name: "preferred_currency",
          label: l.currency,
          options: currencyOptions,
          defaultValue: initial.preferred_currency
        }
      ),
      /* @__PURE__ */ jsx8(
        Field,
        {
          name: "date_of_birth",
          label: l.dob,
          type: "date",
          defaultValue: initial.date_of_birth ?? ""
        }
      ),
      /* @__PURE__ */ jsx8(
        Field,
        {
          name: "street_address",
          label: l.address,
          defaultValue: initial.street_address ?? "",
          autoComplete: "street-address"
        }
      ),
      /* @__PURE__ */ jsx8(
        Field,
        {
          name: "country_of_residence",
          label: l.country,
          defaultValue: initial.country_of_residence ?? "",
          autoComplete: "country-name"
        }
      ),
      /* @__PURE__ */ jsx8(SubmitButton, { pending, pendingLabel: "Saving\u2026", children: submitLabel })
    ] })
  ] });
}
export {
  AUTH_CSS,
  AUTH_STYLE_ID,
  AuthCard,
  AuthForm,
  AuthLink,
  AuthStyles,
  CheckCircleIcon,
  CheckIcon,
  Checkbox,
  Claim,
  Divider,
  EyeIcon,
  EyeOffIcon,
  Field,
  ForgotPassword,
  FormError,
  LockIcon,
  Login,
  MagicLinkCallback,
  MagicLinkRequest,
  MailIcon,
  OtpField,
  PasswordField,
  PasswordStrengthMeter,
  PhoneIcon,
  ProfileForm,
  Register,
  SelectField,
  SpinnerIcon,
  StatusScreen,
  SubmitButton,
  UserIcon,
  XCircleIcon
};
