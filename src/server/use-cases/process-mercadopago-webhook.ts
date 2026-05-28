import {
  getMerchantOrderById,
  getPaymentById,
  type MercadoPagoMerchantOrder,
  type MercadoPagoMerchantOrderPayment,
  type MercadoPagoPayment,
} from "@/lib/payments/mercadopago/client";
import { validateMercadoPagoWebhookSignature } from "@/lib/payments/mercadopago/webhook";
import { finalizePaidOrder } from "@/server/use-cases/finalize-paid-order";
import type { UseCaseResult } from "@/server/use-cases/use-case-result";

type ProcessMercadoPagoWebhookInput = {
  topic?: string | null;
  type?: string | null;
  bodyType?: string | null;
  dataId?: string | null;
  legacyId?: string | null;
  bodyDataId?: string | null;
  xSignature?: string | null;
  xRequestId?: string | null;
};

function resolveWebhookTopic(input: ProcessMercadoPagoWebhookInput) {
  return input.type ?? input.topic ?? input.bodyType ?? null;
}

function resolveWebhookResourceId(input: ProcessMercadoPagoWebhookInput) {
  return input.dataId ?? input.legacyId ?? input.bodyDataId ?? null;
}

function resolveWebhookDataIdSource(input: ProcessMercadoPagoWebhookInput) {
  if (input.dataId) {
    return "query:data.id";
  }

  if (input.legacyId) {
    return "query:id";
  }

  if (input.bodyDataId) {
    return "body:data.id";
  }

  return "missing";
}

function isDevelopmentEnvironment() {
  return process.env.NODE_ENV !== "production";
}

function isUnsignedMerchantOrderBypassEnabled(topic: string | null) {
  return (
    isDevelopmentEnvironment() &&
    isMerchantOrderTopic(topic) &&
    process.env.MERCADO_PAGO_ALLOW_UNSIGNED_WEBHOOK_DEV === "true"
  );
}

function buildFinalizeInputFromMerchantOrder(input: {
  payment: MercadoPagoPayment;
  externalReference: string;
  paidAmount: number;
}) {
  return {
    mercadoPagoPaymentId: input.payment.id,
    externalReference: input.externalReference,
    paymentStatus: input.payment.status,
    currencyId: input.payment.currencyId,
    paidAmount: input.paidAmount,
    payerEmail: input.payment.payerEmail,
  };
}

function isPaymentTopic(topic: string | null) {
  return topic === "payment";
}

function isMerchantOrderTopic(topic: string | null) {
  return topic === "merchant_order" || topic === "topic_merchant_order_wh";
}

function getApprovedPayments(merchantOrder: MercadoPagoMerchantOrder) {
  return merchantOrder.payments.filter(
    (payment): payment is MercadoPagoMerchantOrderPayment =>
      payment.status === "approved" && payment.transactionAmount !== null,
  );
}

function getApprovedTotal(payments: MercadoPagoMerchantOrderPayment[]) {
  return payments.reduce((total, payment) => total + (payment.transactionAmount ?? 0), 0);
}

export async function processMercadoPagoWebhook(
  input: ProcessMercadoPagoWebhookInput,
): Promise<UseCaseResult<null>> {
  const topic = resolveWebhookTopic(input);
  const resourceId = resolveWebhookResourceId(input);
  const dataIdSource = resolveWebhookDataIdSource(input);

  if (isDevelopmentEnvironment()) {
    console.info("[mercadopago] Webhook diagnostic", {
      hasXSignature: Boolean(input.xSignature),
      hasXRequestId: Boolean(input.xRequestId),
      dataIdSource,
      webhookType: topic,
      webhookSecretLength:
        process.env.MERCADO_PAGO_WEBHOOK_SECRET?.trim().length ?? 0,
    });
  }

  if (isPaymentTopic(topic)) {
    console.info("[mercadopago] Payment webhook ignored for fulfillment", {
      topic,
      dataIdSource,
      hasSignature: Boolean(input.xSignature),
      hasXRequestId: Boolean(input.xRequestId),
      resourceId,
    });

    return {
      success: true,
      status: 202,
      message: "Notificacion payment ignorada: merchant_order es la fuente de verdad.",
      data: null,
    };
  }

  if (!isMerchantOrderTopic(topic)) {
    return {
      success: true,
      status: 202,
      message: "Notificacion ignorada: topic no soportado.",
      data: null,
    };
  }

  if (!input.dataId) {
    console.warn("[mercadopago] Merchant order notification without query data.id", {
      topic,
      dataIdSource,
      hasSignature: Boolean(input.xSignature),
    });

    return {
      success: false,
      status: 400,
      message:
        "La notificacion merchant_order no incluye data.id para validar la firma del webhook.",
    };
  }

  let isValidSignature = false;
  let shouldBypassInvalidSignature = false;

  try {
    isValidSignature = validateMercadoPagoWebhookSignature({
      dataId: input.dataId ?? null,
      xSignature: input.xSignature ?? null,
      xRequestId: input.xRequestId ?? null,
    });
  } catch (error) {
    console.error("[mercadopago] Webhook signature validation failed", {
      dataId: input.dataId,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });

    return {
      success: false,
      status: 500,
      message: "No se pudo validar la firma del webhook merchant_order de Mercado Pago.",
    };
  }

  shouldBypassInvalidSignature =
    !isValidSignature && isUnsignedMerchantOrderBypassEnabled(topic);

  if (!isValidSignature) {
    if (shouldBypassInvalidSignature) {
      console.warn("[mercadopago] DEV ONLY: merchant_order signature bypass enabled", {
        topic,
        dataId: input.dataId,
        hasSignature: Boolean(input.xSignature),
        hasXRequestId: Boolean(input.xRequestId),
      });
    } else {
      return {
        success: false,
        status: 401,
        message: "La firma del webhook merchant_order de Mercado Pago no es valida.",
      };
    }
  }

  const merchantOrder = await getMerchantOrderById(input.dataId);

  if (!merchantOrder.externalReference) {
    return {
      success: false,
      status: 400,
      message: "La merchant order de Mercado Pago no incluye external_reference.",
    };
  }

  const approvedPayments = getApprovedPayments(merchantOrder);

  if (approvedPayments.length === 0) {
    console.info("[mercadopago] Merchant order ignored without approved payments", {
      merchantOrderId: merchantOrder.id,
      status: merchantOrder.status,
      orderStatus: merchantOrder.orderStatus,
      externalReference: merchantOrder.externalReference,
    });

    return {
      success: true,
      status: 202,
      message: "La merchant order todavia no tiene pagos aprobados.",
      data: null,
    };
  }

  const approvedTotal = getApprovedTotal(approvedPayments);

  if (merchantOrder.totalAmount === null) {
    return {
      success: false,
      status: 400,
      message: "La merchant order de Mercado Pago no devolvio total_amount.",
    };
  }

  if (approvedTotal < merchantOrder.totalAmount) {
    console.info("[mercadopago] Merchant order ignored with insufficient approved total", {
      merchantOrderId: merchantOrder.id,
      approvedTotal,
      totalAmount: merchantOrder.totalAmount,
      approvedPaymentsCount: approvedPayments.length,
      externalReference: merchantOrder.externalReference,
    });

    return {
      success: true,
      status: 202,
      message: "La merchant order todavia no cubre el total con pagos aprobados.",
      data: null,
    };
  }

  const primaryApprovedPayment = approvedPayments[0];

  const payment = await getPaymentById(primaryApprovedPayment.id);

  if (payment.externalReference && payment.externalReference !== merchantOrder.externalReference) {
    console.warn("[mercadopago] Merchant order/payment external_reference mismatch", {
      merchantOrderId: merchantOrder.id,
      paymentId: payment.id,
      merchantOrderExternalReference: merchantOrder.externalReference,
      paymentExternalReference: payment.externalReference,
    });
  }

  if (payment.status !== "approved") {
    console.warn("[mercadopago] Approved payment in merchant order not approved on payment fetch", {
      merchantOrderId: merchantOrder.id,
      paymentId: payment.id,
      paymentStatus: payment.status,
      externalReference: merchantOrder.externalReference,
    });

    return {
      success: true,
      status: 202,
      message: "El payment asociado todavia no esta aprobado al consultar la API.",
      data: null,
    };
  }

  const finalizeResult = await finalizePaidOrder(
    buildFinalizeInputFromMerchantOrder({
      payment,
      externalReference: merchantOrder.externalReference,
      paidAmount: approvedTotal,
    }),
  );

  if (!finalizeResult.success) {
    return finalizeResult;
  }

  return {
    success: true,
    status: 200,
    message: "Webhook procesado correctamente.",
    data: null,
  };
}
