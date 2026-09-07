/**
 * Self-contained styling for the shared auth screens.
 *
 * Everything is scoped under `.kpa-root` and driven by CSS variables, so the
 * screens render IDENTICALLY in every app regardless of the host's design
 * system (Tailwind, tokens, resets). The palette is KinPay's — purple primary
 * with a gradient, coral for errors — in light and dark. Consumers don't import
 * a CSS file or configure anything: `<AuthStyles />` injects this once.
 */
import { createElement, type ReactElement } from "react";

export const AUTH_STYLE_ID = "kinpay-auth-core-ui";

export const AUTH_CSS = `
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

/**
 * Injects {@link AUTH_CSS} exactly once. Rendered by every screen, so consumers
 * never import a stylesheet. It renders a real <style> element (SSR-safe: the
 * markup is in the server output too), and dedupes by id at runtime.
 */
export function AuthStyles(): ReactElement | null {
  if (typeof document !== "undefined" && document.getElementById(AUTH_STYLE_ID)) {
    return null;
  }
  return createElement("style", { id: AUTH_STYLE_ID, dangerouslySetInnerHTML: { __html: AUTH_CSS } });
}
