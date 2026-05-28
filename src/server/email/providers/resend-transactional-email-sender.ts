import { Resend } from "resend";
import type { TransactionalEmailSender } from "@/server/email/transactional-email-sender";
import type {
  TransactionalEmailConfig,
  TransactionalEmailMessage,
  TransactionalEmailSendResult,
} from "@/server/email/types";

type ResendErrorLike = {
  name?: string;
  message?: string;
  statusCode?: number;
};

function mapResendFailure(error: ResendErrorLike | null | undefined): Omit<
  Extract<TransactionalEmailSendResult, { ok: false }>,
  "provider"
> {
  const message = error?.message ?? "No se pudo enviar el email transaccional.";
  const statusCode = error?.statusCode;

  if (statusCode === 400 || statusCode === 409 || statusCode === 422) {
    return {
      ok: false,
      code: "invalid_request",
      message,
      retryable: false,
    };
  }

  if (statusCode === 429) {
    return {
      ok: false,
      code: "rate_limit",
      message,
      retryable: true,
    };
  }

  if (statusCode && statusCode >= 500) {
    return {
      ok: false,
      code: "provider_error",
      message,
      retryable: true,
    };
  }

  return {
    ok: false,
    code: "unknown",
    message,
    retryable: true,
  };
}

export class ResendTransactionalEmailSender implements TransactionalEmailSender {
  private readonly resend: Resend;

  constructor(private readonly config: TransactionalEmailConfig) {
    if (!config.resendApiKey) {
      throw new Error("ResendTransactionalEmailSender requiere resendApiKey.");
    }

    this.resend = new Resend(config.resendApiKey);
  }

  async send(
    message: TransactionalEmailMessage,
  ): Promise<TransactionalEmailSendResult> {
    const { data, error } = await this.resend.emails.send(
      {
        from: this.config.from,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
        replyTo: message.replyTo ?? this.config.replyTo,
        tags: message.tags,
      },
      message.idempotencyKey
        ? {
            idempotencyKey: message.idempotencyKey,
          }
        : undefined,
    );

    if (error) {
      const mapped = mapResendFailure(error);

      return {
        provider: "resend",
        ...mapped,
      };
    }

    return {
      ok: true,
      provider: "resend",
      messageId: data?.id,
    };
  }
}
