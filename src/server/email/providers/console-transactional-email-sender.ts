import type { TransactionalEmailSender } from "@/server/email/transactional-email-sender";
import type {
  TransactionalEmailConfig,
  TransactionalEmailMessage,
  TransactionalEmailSendResult,
} from "@/server/email/types";

export class ConsoleTransactionalEmailSender implements TransactionalEmailSender {
  constructor(private readonly config: TransactionalEmailConfig) {}

  async send(
    message: TransactionalEmailMessage,
  ): Promise<TransactionalEmailSendResult> {
    console.info("[email:console]", {
      from: this.config.from,
      replyTo: message.replyTo ?? this.config.replyTo,
      baseUrl: this.config.baseUrl,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
      tags: message.tags,
      idempotencyKey: message.idempotencyKey,
    });

    return {
      ok: true,
      provider: "console",
    };
  }
}
