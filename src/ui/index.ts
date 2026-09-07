/**
 * kinpay-auth-core/ui — the shared auth screens + their building blocks.
 *
 * Self-contained, consistently-styled, behavior-via-props so both the KinPay app
 * and the Circles Portal render identical auth surfaces. React is a runtime
 * dependency the consumer provides (bundled `--external:react`).
 */
export { Login, type LoginProps, type LoginValues } from "./Login";
export { Register, type RegisterProps, type RegisterValues } from "./Register";

export {
  AuthCard, type AuthCardProps,
  AuthForm, Field, type FieldProps, PasswordField, type PasswordFieldProps,
  PasswordStrengthMeter, Checkbox,
  SubmitButton, FormError, Divider, AuthLink,
  type LinkLike, type NavProps,
  MailIcon, LockIcon, PhoneIcon, UserIcon, EyeIcon, EyeOffIcon, CheckIcon,
} from "./primitives";

export { AUTH_CSS, AUTH_STYLE_ID, AuthStyles } from "./styles";
