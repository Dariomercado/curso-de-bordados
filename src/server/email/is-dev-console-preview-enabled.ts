export function isDevConsolePreviewEnabled() {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.AUTH_EMAIL_PROVIDER?.trim() === "console"
  );
}
