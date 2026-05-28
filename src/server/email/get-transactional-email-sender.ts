import { getTransactionalEmailConfig } from "@/server/email/config";
import type { TransactionalEmailSender } from "@/server/email/transactional-email-sender";
import { ConsoleTransactionalEmailSender } from "@/server/email/providers/console-transactional-email-sender";
import { ResendTransactionalEmailSender } from "@/server/email/providers/resend-transactional-email-sender";

export function getTransactionalEmailSender(): TransactionalEmailSender {
  const config = getTransactionalEmailConfig();

  if (config.provider === "resend") {
    return new ResendTransactionalEmailSender(config);
  }

  return new ConsoleTransactionalEmailSender(config);
}
