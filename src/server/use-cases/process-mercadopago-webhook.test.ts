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

  it("finalizes the order when the merchant_order id arrives in the legacy query id parameter", async () => {
    validateMercadoPagoWebhookSignatureMock.mockReturnValue(true);
    getMerchantOrderByIdMock.mockResolvedValue({
      id: "191562251316",
      status: "closed",
      orderStatus: "paid",
      externalReference: "order_1",
      totalAmount: 5200,
      paidAmount: 5200,
      payments: [
        {
          id: "191562251316",
          status: "approved",
          transactionAmount: 5200,
        },
      ],
    });
    getPaymentByIdMock.mockResolvedValue({
      id: "191562251316",
      status: "approved",
      statusDetail: "accredited",
      externalReference: "order_1",
      currencyId: "ARS",
      transactionAmount: 5200,
      payerEmail: "comprador.e2e@example.com",
      dateApproved: "2026-11-25T14:44:28.000Z",
    });
    finalizePaidOrderMock.mockResolvedValue({
      success: true,
      status: 200,
      message: "Orden finalizada correctamente.",
      data: {
        orderId: "order-db-1",
        userId: "user-1",
        mercadoPagoPaymentId: "191562251316",
      },
    });

    const result = await processMercadoPagoWebhook({
      topic: "merchant_order",
      legacyId: "191562251316",
      xSignature: "ts=1795617867,v1=abc",
      xRequestId: "req-1",
    });

    expect(validateMercadoPagoWebhookSignatureMock).toHaveBeenCalledWith({
      dataId: "191562251316",
      xSignature: "ts=1795617867,v1=abc",
      xRequestId: "req-1",
    });
    expect(getMerchantOrderByIdMock).toHaveBeenCalledWith("191562251316");
    expect(finalizePaidOrderMock).toHaveBeenCalledOnce();
    expect(result).toEqual({
      success: true,
      status: 200,
      message: "Webhook procesado correctamente.",
      data: null,
    });
  });

  it("finalizes the order for an approved payment notification", async () => {
    validateMercadoPagoWebhookSignatureMock.mockReturnValue(true);
    getPaymentByIdMock.mockResolvedValue({
      id: "191562251316",
      status: "approved",
      statusDetail: "accredited",
      externalReference: "order_1",
      currencyId: "ARS",
      transactionAmount: 5200,
      payerEmail: "comprador.e2e@example.com",
      dateApproved: "2026-11-25T15:01:00.000Z",
    });
    finalizePaidOrderMock.mockResolvedValue({
      success: true,
      status: 200,
      message: "Orden finalizada correctamente.",
      data: {
        orderId: "order-db-1",
        userId: "user-1",
        mercadoPagoPaymentId: "191562251316",
      },
    });

    const result = await processMercadoPagoWebhook({
      type: "payment",
      dataId: "191562251316",
      xSignature: "ts=123,v1=abc",
      xRequestId: "req-1",
    });

    expect(validateMercadoPagoWebhookSignatureMock).toHaveBeenCalledWith({
      dataId: "191562251316",
      xSignature: "ts=123,v1=abc",
      xRequestId: "req-1",
    });
    expect(getPaymentByIdMock).toHaveBeenCalledWith("191562251316");
    expect(finalizePaidOrderMock).toHaveBeenCalledOnce();
    expect(finalizePaidOrderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        externalReference: "order_1",
        paidAmount: 5200,
      }),
    );
    expect(result).toEqual({
      success: true,
      status: 200,
      message: "Webhook procesado correctamente.",
      data: null,
    });
  });

  it("does not finalize a payment notification that is not approved", async () => {
    validateMercadoPagoWebhookSignatureMock.mockReturnValue(true);
    getPaymentByIdMock.mockResolvedValue({
      id: "191562251316",
      status: "in_process",
      statusDetail: "pending_contingency",
      externalReference: "order_1",
      currencyId: "ARS",
      transactionAmount: 5200,
      payerEmail: "comprador.e2e@example.com",
      dateApproved: null,
    });

    const result = await processMercadoPagoWebhook({
      type: "payment",
      dataId: "191562251316",
      xSignature: "ts=123,v1=abc",
      xRequestId: "req-1",
    });

    expect(finalizePaidOrderMock).not.toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.status).toBe(202);
  });

  it("rejects a payment notification with an invalid signature without finalizing", async () => {
    validateMercadoPagoWebhookSignatureMock.mockReturnValue(false);

    const result = await processMercadoPagoWebhook({
      type: "payment",
      dataId: "191562251316",
      xSignature: "ts=123,v1=abc",
      xRequestId: "req-1",
    });

    expect(result).toEqual({
      success: false,
      status: 401,
      message: "La firma del webhook de Mercado Pago no es valida.",
    });
    expect(getPaymentByIdMock).not.toHaveBeenCalled();
    expect(finalizePaidOrderMock).not.toHaveBeenCalled();
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
      message: "La firma del webhook de Mercado Pago no es valida.",
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
      message: "La firma del webhook de Mercado Pago no es valida.",
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
