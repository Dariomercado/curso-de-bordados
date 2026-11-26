import type { TransactionalEmailSender } from "@/server/email/transactional-email-sender";
import type {
  TransactionalEmailConfig,
  TransactionalEmailMessage,
  TransactionalEmailSendResult,
} from "@/server/email/types";

const BREVO_TRANSACTIONAL_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const BREVO_REQUEST_TIMEOUT_MS = 10_000;

type Failure = Omit<Extract<TransactionalEmailSendResult, { ok: false }>, "provider">;

type BrevoAddress = {
  email: string;
  name?: string;
};

type BrevoRequestBody = {
  sender: BrevoAddress;
  to: BrevoAddress[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  replyTo?: BrevoAddress;
  tags?: string[];
  headers?: Record<string, string>;
};

/**
 * Brevo accepts `Name <email>` in a single field, while its API expects the
 * address and the display name separately.
 */
function parseAddress(value: string): BrevoAddress {
  const match = /^\s*(.*?)\s*<([^>]+)>\s*$/.exec(value);

  if (!match) {
    return { email: value.trim() };
  }

  const name = match[1].trim();
  const email = match[2].trim();

  return name ? { email, name } : { email };
}

function buildRequestBody(
  config: TransactionalEmailConfig,
  message: TransactionalEmailMessage,
): BrevoRequestBody {
  const replyTo = message.replyTo ?? config.replyTo;

  const body: BrevoRequestBody = {
    sender: parseAddress(config.from),
    to: [{ email: message.to }],
    subject: message.subject,
    htmlContent: message.html,
  };

  if (message.text) {
    body.textContent = message.text;
  }

  if (replyTo) {
    body.replyTo = { email: replyTo };
  }

  if (message.tags?.length) {
    // Brevo tags are plain strings, so the tag name is dropped and its value kept.
    body.tags = message.tags.map((tag) => tag.value);
  }

  if (message.idempotencyKey) {
    body.headers = { IdempotencyKey: message.idempotencyKey };
  }

  return body;
}

function isCreditExhaustion(status: number, code: string | undefined) {
  return (
    status === 402 ||
    code === "not_enough_credits" ||
    code === "Insufficient credits"
  );
}

function mapBrevoFailure(
  status: number,
  code: string | undefined,
  message: string,
): Failure {
  if (isCreditExhaustion(status, code)) {
    return {
      ok: false,
      code: "provider_error",
      message,
      retryable: false,
    };
  }

  if (status === 401 || status === 403) {
    return { ok: false, code: "config_error", message, retryable: false };
  }

  if (status === 429) {
    return { ok: false, code: "rate_limit", message, retryable: true };
  }

  if (status >= 400 && status < 500) {
    return { ok: false, code: "invalid_request", message, retryable: false };
  }

  if (status >= 500) {
    return { ok: false, code: "provider_error", message, retryable: true };
  }

  return { ok: false, code: "unknown", message, retryable: true };
}

async function readBrevoResponse(response: Response): Promise<{
  code?: string;
  message?: string;
  messageId?: string;
}> {
  const raw = await response.text().catch(() => "");

  if (!raw) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    const record = parsed as Record<string, unknown>;

    return {
      code: typeof record.code === "string" ? record.code : undefined,
      message: typeof record.message === "string" ? record.message : undefined,
      messageId:
        typeof record.messageId === "string" ? record.messageId : undefined,
    };
  } catch {
    return { message: raw.slice(0, 500) };
  }
}

export class BrevoTransactionalEmailSender implements TransactionalEmailSender {
  constructor(private readonly config: TransactionalEmailConfig) {
    if (!config.brevoApiKey) {
      throw new Error("BrevoTransactionalEmailSender requiere brevoApiKey.");
    }
  }

  async send(
    message: TransactionalEmailMessage,
  ): Promise<TransactionalEmailSendResult> {
    let response: Response;

    try {
      response = await fetch(BREVO_TRANSACTIONAL_ENDPOINT, {
        method: "POST",
        headers: {
          "api-key": this.config.brevoApiKey as string,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(buildRequestBody(this.config, message)),
        signal: AbortSignal.timeout(BREVO_REQUEST_TIMEOUT_MS),
      });
    } catch (error) {
      return {
        ok: false,
        provider: "brevo",
        code: "provider_error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo enviar el email transaccional.",
        retryable: true,
      };
    }

    const payload = await readBrevoResponse(response);

    if (!response.ok) {
      return {
        provider: "brevo",
        ...mapBrevoFailure(
          response.status,
          payload.code,
          payload.message ?? `Brevo respondio ${response.status}.`,
        ),
      };
    }

    return {
      ok: true,
      provider: "brevo",
      messageId: payload.messageId,
    };
  }
}
