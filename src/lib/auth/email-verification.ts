export const emailVerificationResultCodes = [
  "success",
  "invalid",
  "expired",
  "used",
] as const;

export type EmailVerificationResultCode =
  (typeof emailVerificationResultCodes)[number];

export function parseEmailVerificationResultCode(
  value: string | undefined,
): EmailVerificationResultCode | null {
  if (!value) {
    return null;
  }

  return emailVerificationResultCodes.includes(
    value as EmailVerificationResultCode,
  )
    ? (value as EmailVerificationResultCode)
    : null;
}

export function buildEmailVerificationResultUrl(
  origin: string,
  code: EmailVerificationResultCode,
) {
  const url = new URL("/verificar-email", origin);
  url.searchParams.set("code", code);
  return url.toString();
}
