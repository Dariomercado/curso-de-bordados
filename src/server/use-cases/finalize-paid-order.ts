import { AuthTokenType, OrderStatus, Prisma, ProductType } from "@prisma/client";
import {
  buildPasswordResetUrl,
  generatePlaintextToken,
  getPasswordResetTokenExpiryDate,
  hashToken,
} from "@/lib/auth/tokens";
import { prisma } from "@/lib/db/prisma";
import { getTransactionalEmailConfig } from "@/server/email/config";
import { getTransactionalEmailSender } from "@/server/email/get-transactional-email-sender";
import { buildAccessActivationMessage } from "@/server/email/messages/auth/build-password-reset-message";
import {
  createAuthToken,
  invalidateAuthTokensByUserIdAndType,
} from "@/server/repositories/auth-token-repository";
import { createEnrollmentIfMissing } from "@/server/repositories/enrollment-repository";
import {
  findOrderByExternalReferenceForFulfillment,
  markOrderPaid,
} from "@/server/repositories/order-repository";
import { upsertUserByEmail } from "@/server/repositories/user-repository";
import type { UseCaseResult } from "@/server/use-cases/use-case-result";

type FinalizePaidOrderInput = {
  mercadoPagoPaymentId: string;
  externalReference: string;
  paymentStatus: string | null;
  currencyId: string | null;
  paidAmount: number | null;
  payerEmail: string | null;
};

type FinalizePaidOrderData = {
  orderId: string;
  userId: string;
  mercadoPagoPaymentId: string;
};

type AccessActivationEmail = {
  to: string;
  name: string | null;
  plaintextToken: string;
};

async function sendAccessActivationEmail(input: AccessActivationEmail) {
  try {
    const emailConfig = getTransactionalEmailConfig();
    const resetUrl = buildPasswordResetUrl(emailConfig.baseUrl, input.plaintextToken);
    const sender = getTransactionalEmailSender();
    const message = await buildAccessActivationMessage({
      to: input.to,
      name: input.name,
      resetUrl,
    });
    const sendResult = await sender.send(message);

    if (!sendResult.ok) {
      console.warn("[mercadopago] Access activation delivery failed", {
        email: input.to,
        provider: sendResult.provider,
        code: sendResult.code,
        retryable: sendResult.retryable,
      });
      return;
    }

    console.info("[mercadopago] Access activation delivered", {
      email: input.to,
      provider: sendResult.provider,
      messageId: sendResult.messageId,
    });
  } catch (error) {
    console.warn("[mercadopago] Access activation email could not be prepared", {
      email: input.to,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function finalizePaidOrder(
  input: FinalizePaidOrderInput,
): Promise<UseCaseResult<FinalizePaidOrderData>> {
  const order = await findOrderByExternalReferenceForFulfillment(input.externalReference);

  if (!order) {
    return {
      success: false,
      status: 404,
      message: "No existe una orden para la referencia externa recibida.",
    };
  }

  if (input.paymentStatus !== "approved") {
    return {
      success: false,
      status: 400,
      message: "El pago recibido todavia no esta aprobado.",
    };
  }

  if (input.currencyId && input.currencyId !== "ARS") {
    return {
      success: false,
      status: 400,
      message: "La moneda del pago no coincide con la configuracion esperada.",
    };
  }

  if (input.paidAmount === null) {
    return {
      success: false,
      status: 400,
      message: "Mercado Pago no devolvio el monto pagado.",
    };
  }

  const expectedTotal = order.total.toFixed(2);
  const paidTotal = new Prisma.Decimal(input.paidAmount).toFixed(2);

  if (expectedTotal !== paidTotal) {
    return {
      success: false,
      status: 400,
      message: "El monto pagado no coincide con la orden.",
    };
  }

  if (order.status === OrderStatus.PAID) {
    if (order.mercadoPagoPaymentId === input.mercadoPagoPaymentId) {
      return {
        success: true,
        status: 200,
        message: "La orden ya habia sido finalizada previamente.",
        data: {
          orderId: order.id,
          userId: order.userId ?? "",
          mercadoPagoPaymentId: input.mercadoPagoPaymentId,
        },
      };
    }

    return {
      success: false,
      status: 409,
      message: "La orden ya esta asociada a otro pago aprobado.",
    };
  }

  const courseItems = order.items.filter((item) => item.type === ProductType.COURSE);

  if (courseItems.length === 0) {
    return {
      success: false,
      status: 400,
      message: "La orden no contiene items de curso para asignar.",
    };
  }

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const user = await upsertUserByEmail(order.buyerEmail, tx);
        let activationEmail: AccessActivationEmail | null = null;

        for (const item of courseItems) {
          await createEnrollmentIfMissing(user.id, item.productId, tx);
        }

        if (!user.passwordHash) {
          const plaintextToken = generatePlaintextToken();

          await invalidateAuthTokensByUserIdAndType(
            user.id,
            AuthTokenType.PASSWORD_RESET,
            tx,
          );

          await createAuthToken(
            {
              userId: user.id,
              type: AuthTokenType.PASSWORD_RESET,
              tokenHash: hashToken(plaintextToken),
              expiresAt: getPasswordResetTokenExpiryDate(),
            },
            tx,
          );

          activationEmail = {
            to: user.email,
            name: user.name,
            plaintextToken,
          };
        }

        await markOrderPaid(
          {
            orderId: order.id,
            userId: user.id,
            mercadoPagoPaymentId: input.mercadoPagoPaymentId,
          },
          tx,
        );

        return {
          orderId: order.id,
          userId: user.id,
          mercadoPagoPaymentId: input.mercadoPagoPaymentId,
          activationEmail,
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );

    if (result.activationEmail) {
      await sendAccessActivationEmail(result.activationEmail);
    }

    if (input.payerEmail && input.payerEmail !== order.buyerEmail) {
      console.warn("[mercadopago] Buyer email differs from payer email", {
        orderId: order.id,
        buyerEmail: order.buyerEmail,
        payerEmail: input.payerEmail,
        externalReference: order.externalReference,
      });
    }

    return {
      success: true,
      status: 200,
      message: "Orden finalizada correctamente.",
      data: {
        orderId: result.orderId,
        userId: result.userId,
        mercadoPagoPaymentId: result.mercadoPagoPaymentId,
      },
    };
  } catch (error) {
    const latestOrder = await findOrderByExternalReferenceForFulfillment(
      input.externalReference,
    );

    if (
      latestOrder?.status === OrderStatus.PAID &&
      latestOrder.mercadoPagoPaymentId === input.mercadoPagoPaymentId
    ) {
      return {
        success: true,
        status: 200,
        message: "La orden ya habia sido finalizada previamente.",
        data: {
          orderId: latestOrder.id,
          userId: latestOrder.userId ?? "",
          mercadoPagoPaymentId: input.mercadoPagoPaymentId,
        },
      };
    }

    console.error("[mercadopago] Finalize paid order failed", {
      orderId: order.id,
      externalReference: order.externalReference,
      mercadoPagoPaymentId: input.mercadoPagoPaymentId,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });

    return {
      success: false,
      status: 500,
      message: "No se pudo finalizar la orden pagada.",
    };
  }
}
