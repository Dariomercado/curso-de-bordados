export const authSecret =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  (process.env.NODE_ENV !== "production"
    ? "dev-only-auth-secret-change-me"
    : undefined);

if (!authSecret) {
  throw new Error("Define AUTH_SECRET o NEXTAUTH_SECRET para Auth.js.");
}
