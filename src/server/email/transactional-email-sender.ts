import type {
  TransactionalEmailMessage,
  TransactionalEmailSendResult,
} from "@/server/email/types";

export interface TransactionalEmailSender {
  send(message: TransactionalEmailMessage): Promise<TransactionalEmailSendResult>;
}
