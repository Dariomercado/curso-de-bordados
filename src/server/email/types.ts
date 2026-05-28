export type EmailProvider = "console" | "resend";

export type TransactionalEmailTag = {
  name: string;
  value: string;
};

export type TransactionalEmailMessage = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: TransactionalEmailTag[];
  idempotencyKey?: string;
};

export type TransactionalEmailSendErrorCode =
  | "config_error"
  | "provider_error"
  | "rate_limit"
  | "invalid_request"
  | "unknown";

export type TransactionalEmailSendResult =
  | {
      ok: true;
      provider: EmailProvider;
      messageId?: string;
    }
  | {
      ok: false;
      provider: EmailProvider;
      code: TransactionalEmailSendErrorCode;
      message: string;
      retryable: boolean;
    };

export type TransactionalEmailConfig = {
  provider: EmailProvider;
  from: string;
  replyTo?: string;
  baseUrl: string;
  resendApiKey?: string;
};
