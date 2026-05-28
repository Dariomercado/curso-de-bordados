import { createHash, randomBytes } from "node:crypto";

const EMAIL_VERIFICATION_TOKEN_TTL_HOURS = 48;
const PASSWORD_RESET_TOKEN_TTL_HOURS = 2;

export function generatePlaintextToken(size = 32) {
  return randomBytes(size).toString("base64url");
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getEmailVerificationTokenExpiryDate(now = new Date()) {
  return new Date(
    now.getTime() + EMAIL_VERIFICATION_TOKEN_TTL_HOURS * 60 * 60 * 1000,
  );
}

export function getPasswordResetTokenExpiryDate(now = new Date()) {
  return new Date(
    now.getTime() + PASSWORD_RESET_TOKEN_TTL_HOURS * 60 * 60 * 1000,
  );
}

export function buildEmailVerificationUrl(origin: string, token: string) {
  const url = new URL("/api/auth/email/verify", origin);
  url.searchParams.set("token", token);
  return url.toString();
}

export function buildPasswordResetUrl(origin: string, token: string) {
  const url = new URL("/restablecer-contrasena", origin);
  url.searchParams.set("token", token);
  return url.toString();
}
