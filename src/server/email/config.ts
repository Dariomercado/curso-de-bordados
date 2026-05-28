import type { EmailProvider, TransactionalEmailConfig } from "@/server/email/types";

function normalizeValue(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeUrl(value: string, fieldName: string) {
  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`La variable ${fieldName} debe ser una URL absoluta valida.`);
  }

  return parsed.toString().replace(/\/$/, "");
}

function getProvider(value: string | undefined): EmailProvider {
  if (!value) {
    return "console";
  }

  if (value === "console" || value === "resend") {
    return value;
  }

  throw new Error("AUTH_EMAIL_PROVIDER debe ser 'console' o 'resend'.");
}

export function getTransactionalEmailConfig(): TransactionalEmailConfig {
  const provider = getProvider(normalizeValue(process.env.AUTH_EMAIL_PROVIDER));
  const from = normalizeValue(process.env.AUTH_EMAIL_FROM);
  const replyTo = normalizeValue(process.env.AUTH_EMAIL_REPLY_TO);
  const baseUrlSource =
    normalizeValue(process.env.AUTH_EMAIL_BASE_URL) ??
    normalizeValue(process.env.NEXT_PUBLIC_SITE_URL) ??
    normalizeValue(process.env.NEXTAUTH_URL);

  if (!from) {
    throw new Error("Define AUTH_EMAIL_FROM para emails transaccionales.");
  }

  if (!baseUrlSource) {
    throw new Error(
      "Define AUTH_EMAIL_BASE_URL, NEXT_PUBLIC_SITE_URL o NEXTAUTH_URL para emails transaccionales.",
    );
  }

  const baseUrl = normalizeUrl(
    baseUrlSource,
    process.env.AUTH_EMAIL_BASE_URL?.trim()
      ? "AUTH_EMAIL_BASE_URL"
      : process.env.NEXT_PUBLIC_SITE_URL?.trim()
        ? "NEXT_PUBLIC_SITE_URL"
        : "NEXTAUTH_URL",
  );

  if (replyTo) {
    normalizeUrl(`mailto:${replyTo}`, "AUTH_EMAIL_REPLY_TO");
  }

  if (provider === "resend") {
    const resendApiKey = normalizeValue(process.env.RESEND_API_KEY);

    if (!resendApiKey) {
      throw new Error("Define RESEND_API_KEY para usar AUTH_EMAIL_PROVIDER=resend.");
    }

    return {
      provider,
      from,
      replyTo,
      baseUrl,
      resendApiKey,
    };
  }

  return {
    provider,
    from,
    replyTo,
    baseUrl,
  };
}
