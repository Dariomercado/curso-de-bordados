import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  getMerchantOrderByIdMock,
  getPaymentByIdMock,
  validateMercadoPagoWebhookSignatureMock,
  finalizePaidOrderMock,
} = vi.hoisted(() => ({
  getMerchantOrderByIdMock: vi.fn(),
  getPaymentByIdMock: vi.fn(),
  validateMercadoPagoWebhookSignatureMock: vi.fn(),
  finalizePaidOrderMock: vi.fn(),
}));

vi.mock("@/lib/payments/mercadopago/client", () => ({
  getMerchantOrderById: getMerchantOrderByIdMock,
  getPaymentById: getPaymentByIdMock,
}));

vi.mock("@/lib/payments/mercadopago/webhook", () => ({
  validateMercadoPagoWebhookSignature: validateMercadoPagoWebhookSignatureMock,
}));

vi.mock("@/server/use-cases/finalize-paid-order", () => ({
  finalizePaidOrder: finalizePaidOrderMock,
}));

import { processMercadoPagoWebhook } from "@/server/use-cases/process-mercadopago-webhook";

describe("processMercadoPagoWebhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NODE_ENV = "test";
    delete process.env.MERCADO_PAGO_ALLOW_UNSIGNED_WEBHOOK_DEV;
  });

  it("ignores unsupported topics", async () => {
    const result = await processMercadoPagoWebhook({
      type: "something_else",
      dataId: "123",
    });

    expect(result).toEqual({
      success: true,
      status: 202,
      message: "Notificacion ignorada: topic no soportado.",
      data: null,
    });
    expect(validateMercadoPagoWebhookSignatureMock).not.toHaveBeenCalled();
  });

  it("returns 400 when data.id is missing", async () => {
    const result = await processMercadoPagoWebhook({
      type: "topic_merchant_order_wh",
    });

    expect(result).toEqual({
      success: false,
      status: 400,
      message:
        "La notificacion merchant_order no incluye data.id para validar la firma del webhook.",
    });
  });

  it("ignores payment notifications as non-business events", async () => {
    const result = await processMercadoPagoWebhook({
      type: "payment",
      dataId: "123",
      xSignature: "ts=123,v1=abc",
      xRequestId: "req-1",
    });

    expect(result).toEqual({
      success: true,
      status: 202,
      message:
        "Notificacion payment ignorada: merchant_order es la fuente de verdad.",
      data: null,
    });
    expect(validateMercadoPagoWebhookSignatureMock).not.toHaveBeenCalled();
    expect(getMerchantOrderByIdMock).not.toHaveBeenCalled();
    expect(getPaymentByIdMock).not.toHaveBeenCalled();
  });

  it("returns 401 when the merchant_order webhook signature is invalid", async () => {
    validateMercadoPagoWebhookSignatureMock.mockReturnValue(false);

    const result = await processMercadoPagoWebhook({
      type: "topic_merchant_order_wh",
      dataId: "123",
      xSignature: "ts=123,v1=abc",
      xRequestId: "req-1",
    });

    expect(result).toEqual({
      success: false,
      status: 401,
      message: "La firma del webhook merchant_order de Mercado Pago no es valida.",
    });
    expect(getMerchantOrderByIdMock).not.toHaveBeenCalled();
    expect(getPaymentByIdMock).not.toHaveBeenCalled();
  });

  it("allows unsigned merchant_order webhook in development only when the explicit flag is enabled", async () => {
    process.env.MERCADO_PAGO_ALLOW_UNSIGNED_WEBHOOK_DEV = "true";
    validateMercadoPagoWebhookSignatureMock.mockReturnValue(false);
    getMerchantOrderByIdMock.mockResolvedValue({
      id: "merchant-order-1",
      status: "closed",
      orderStatus: "paid",
      externalReference: "order_1",
      totalAmount: 100,
      paidAmount: 100,
      payments: [
        {
          id: "123",
          status: "approved",
          transactionAmount: 100,
        },
      ],
    });
    getPaymentByIdMock.mockResolvedValue({
      id: "123",
      status: "approved",
      statusDetail: "accredited",
      externalReference: "order_1",
      currencyId: "ARS",
      transactionAmount: 100,
      payerEmail: "buyer@example.com",
      dateApproved: "2026-04-21T12:00:00.000Z",
    });
    finalizePaidOrderMock.mockResolvedValue({
      success: true,
      status: 200,
      message: "Orden finalizada correctamente.",
      data: {
        orderId: "order-db-1",
        userId: "user-1",
        mercadoPagoPaymentId: "123",
      },
    });

    const result = await processMercadoPagoWebhook({
      type: "topic_merchant_order_wh",
      dataId: "123",
      xSignature: "ts=123,v1=abc",
      xRequestId: "req-1",
    });

    expect(getMerchantOrderByIdMock).toHaveBeenCalledWith("123");
    expect(finalizePaidOrderMock).toHaveBeenCalledOnce();
    expect(result).toEqual({
      success: true,
      status: 200,
      message: "Webhook procesado correctamente.",
      data: null,
    });
  });

  it("keeps rejecting unsigned merchant_order webhook in production even with the dev bypass flag", async () => {
    process.env.NODE_ENV = "production";
    process.env.MERCADO_PAGO_ALLOW_UNSIGNED_WEBHOOK_DEV = "true";
    validateMercadoPagoWebhookSignatureMock.mockReturnValue(false);

    const result = await processMercadoPagoWebhook({
      topic: "merchant_order",
      dataId: "123",
      xSignature: "ts=123,v1=abc",
      xRequestId: "req-1",
    });

    expect(result).toEqual({
      success: false,
      status: 401,
      message: "La firma del webhook merchant_order de Mercado Pago no es valida.",
    });
    expect(getMerchantOrderByIdMock).not.toHaveBeenCalled();
    expect(finalizePaidOrderMock).not.toHaveBeenCalled();
  });

  it("returns 202 when the merchant_order has no approved payments", async () => {
    validateMercadoPagoWebhookSignatureMock.mockReturnValue(true);
    getMerchantOrderByIdMock.mockResolvedValue({
      id: "merchant-order-1",
      status: "opened",
      orderStatus: "payment_required",
      externalReference: "order_1",
      totalAmount: 100,
      paidAmount: 0,
      payments: [],
    });

    const result = await processMercadoPagoWebhook({
      type: "topic_merchant_order_wh",
      dataId: "123",
      xSignature: "ts=123,v1=abc",
      xRequestId: "req-1",
    });

    expect(result).toEqual({
      success: true,
      status: 202,
      message: "La merchant order todavia no tiene pagos aprobados.",
      data: null,
    });
    expect(getPaymentByIdMock).not.toHaveBeenCalled();
    expect(finalizePaidOrderMock).not.toHaveBeenCalled();
  });

  it("returns 202 when approved payments do not cover the merchant order total", async () => {
    validateMercadoPagoWebhookSignatureMock.mockReturnValue(true);
    getMerchantOrderByIdMock.mockResolvedValue({
      id: "merchant-order-1",
      status: "opened",
      orderStatus: "payment_in_process",
      externalReference: "order_1",
      totalAmount: 100,
      paidAmount: 50,
      payments: [
        {
          id: "123",
          status: "approved",
          transactionAmount: 50,
        },
      ],
    });

    const result = await processMercadoPagoWebhook({
      topic: "merchant_order",
      dataId: "123",
      xSignature: "ts=123,v1=abc",
      xRequestId: "req-1",
    });

    expect(result).toEqual({
      success: true,
      status: 202,
      message: "La merchant order todavia no cubre el total con pagos aprobados.",
      data: null,
    });
    expect(getPaymentByIdMock).not.toHaveBeenCalled();
    expect(finalizePaidOrderMock).not.toHaveBeenCalled();
  });

  it("finalizes approved merchant orders", async () => {
    validateMercadoPagoWebhookSignatureMock.mockReturnValue(true);
    getMerchantOrderByIdMock.mockResolvedValue({
      id: "merchant-order-1",
      status: "closed",
      orderStatus: "paid",
      externalReference: "order_1",
      totalAmount: 100,
      paidAmount: 100,
      payments: [
        {
          id: "123",
          status: "approved",
          transactionAmount: 100,
        },
      ],
    });
    getPaymentByIdMock.mockResolvedValue({
      id: "123",
      status: "approved",
      statusDetail: "accredited",
      externalReference: "order_1",
      currencyId: "ARS",
      transactionAmount: 100,
      payerEmail: "buyer@example.com",
      dateApproved: "2026-04-21T12:00:00.000Z",
    });
    finalizePaidOrderMock.mockResolvedValue({
      success: true,
      status: 200,
      message: "Orden finalizada correctamente.",
      data: {
        orderId: "order-db-1",
        userId: "user-1",
        mercadoPagoPaymentId: "123",
      },
    });

    const result = await processMercadoPagoWebhook({
      type: "topic_merchant_order_wh",
      dataId: "123",
      xSignature: "ts=123,v1=abc",
      xRequestId: "req-1",
    });

    expect(finalizePaidOrderMock).toHaveBeenCalledWith({
      mercadoPagoPaymentId: "123",
      externalReference: "order_1",
      paymentStatus: "approved",
      currencyId: "ARS",
      paidAmount: 100,
      payerEmail: "buyer@example.com",
    });
    expect(result).toEqual({
      success: true,
      status: 200,
      message: "Webhook procesado correctamente.",
      data: null,
    });
  });
});
