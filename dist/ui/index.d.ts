/**
 * kinpay-auth-core/ui — the shared auth screens + their building blocks.
 *
 * Self-contained, consistently-styled, behavior-via-props so both the KinPay app
 * and the Circles Portal render identical auth surfaces. React is a runtime
 * dependency the consumer provides (bundled `--external:react`).
 */
export { Login, type LoginProps, type LoginValues } from "./Login";
export { Register, type RegisterProps, type RegisterValues } from "./Register";
export { MagicLinkRequest, type MagicLinkRequestProps } from "./MagicLinkRequest";
export { MagicLinkCallback, type MagicLinkCallbackProps } from "./MagicLinkCallback";
export { Claim, type ClaimProps, type ClaimValues } from "./Claim";
export { ForgotPassword, type ForgotPasswordProps } from "./ForgotPassword";
export { AuthCard, type AuthCardProps, AuthForm, Field, type FieldProps, PasswordField, type PasswordFieldProps, PasswordStrengthMeter, Checkbox, OtpField, type OtpFieldProps, StatusScreen, type StatusScreenProps, SubmitButton, FormError, Divider, AuthLink, type LinkLike, type NavProps, MailIcon, LockIcon, PhoneIcon, UserIcon, EyeIcon, EyeOffIcon, CheckIcon, SpinnerIcon, CheckCircleIcon, XCircleIcon, } from "./primitives";
export { AUTH_CSS, AUTH_STYLE_ID, AuthStyles } from "./styles";
