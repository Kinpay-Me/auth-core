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
  --kpa-bg: #FFFFFF;
  --kpa-fg: #1A0F2E;
  --kpa-primary: #9742E7;
  --kpa-primary-from: #7732E8;
  --kpa-primary-to: #B453E6;
  --kpa-primary-fg: #FFFFFF;
  --kpa-muted: #F2EFFE;
  --kpa-muted-fg: #9580B3;
  --kpa-border: #ECE6F8;
  --kpa-field-bg: #F7F5FE;
  --kpa-danger: #FF6B6B;
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
    --kpa-bg: #120A1E;
    --kpa-fg: #F0EAFF;
    --kpa-primary: #B47BF0;
    --kpa-primary-from: #9742E7;
    --kpa-primary-to: #C96CF5;
    --kpa-muted: #261A3A;
    --kpa-muted-fg: #8B77A8;
    --kpa-border: #2E2246;
    --kpa-field-bg: #1B1030;
    --kpa-danger: #FCA5A5;
  }
}
.kpa-root[data-kpa-theme="dark"] {
  --kpa-bg: #120A1E;
  --kpa-fg: #F0EAFF;
  --kpa-primary: #B47BF0;
  --kpa-primary-from: #9742E7;
  --kpa-primary-to: #C96CF5;
  --kpa-muted: #261A3A;
  --kpa-muted-fg: #8B77A8;
  --kpa-border: #2E2246;
  --kpa-field-bg: #1B1030;
  --kpa-danger: #FCA5A5;
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
`;
function AuthStyles() {
  if (typeof document !== "undefined" && document.getElementById(AUTH_STYLE_ID)) {
    return null;
  }
  return createElement("style", { id: AUTH_STYLE_ID, dangerouslySetInnerHTML: { __html: AUTH_CSS } });
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
function PasswordField({ name = "password", label, labelExtra, autoComplete = "current-password", required = true, placeholder = "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }) {
  const [show, setShow] = useState(false);
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
          placeholder
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
    ] })
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
export {
  AUTH_CSS,
  AUTH_STYLE_ID,
  AuthCard,
  AuthForm,
  AuthLink,
  AuthStyles,
  CheckIcon,
  Checkbox,
  Divider,
  EyeIcon,
  EyeOffIcon,
  Field,
  FormError,
  LockIcon,
  Login,
  MailIcon,
  PasswordField,
  PhoneIcon,
  SubmitButton,
  UserIcon
};
