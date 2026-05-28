import { beforeEach, describe, expect, it, vi } from "vitest";

const { processMercadoPagoWebhookMock } = vi.hoisted(() => ({
  processMercadoPagoWebhookMock: vi.fn(),
}));

vi.mock("@/server/use-cases/process-mercadopago-webhook", () => ({
  processMercadoPagoWebhook: processMercadoPagoWebhookMock,
}));

import { POST } from "@/app/api/payments/mercadopago/webhook/route";

describe("POST /api/payments/mercadopago/webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the use-case success response", async () => {
    processMercadoPagoWebhookMock.mockResolvedValue({
      success: true,
      status: 200,
      message: "Webhook procesado correctamente.",
      data: null,
    });

    const request = new Request(
      "http://localhost:3000/api/payments/mercadopago/webhook?type=payment&data.id=123",
      {
        method: "POST",
        headers: {
          "x-signature": "ts=123,v1=abc",
          "x-request-id": "req-1",
        },
      },
    );

    const response = await POST(request);

    expect(processMercadoPagoWebhookMock).toHaveBeenCalledWith({
      bodyDataId: null,
      bodyType: null,
      topic: null,
      type: "payment",
      dataId: "123",
      legacyId: null,
      xSignature: "ts=123,v1=abc",
      xRequestId: "req-1",
    });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      message: "Webhook procesado correctamente.",
      data: null,
    });
  });

  it("returns the use-case error response", async () => {
    processMercadoPagoWebhookMock.mockResolvedValue({
      success: false,
      status: 401,
      message: "La firma del webhook de Mercado Pago no es valida.",
    });

    const request = new Request(
      "http://localhost:3000/api/payments/mercadopago/webhook?type=payment&data.id=123",
      {
        method: "POST",
      },
    );

    const response = await POST(request);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      success: false,
      message: "La firma del webhook de Mercado Pago no es valida.",
      data: null,
    });
  });

  it("returns 500 when the route throws unexpectedly", async () => {
    processMercadoPagoWebhookMock.mockRejectedValue(new Error("boom"));

    const request = new Request(
      "http://localhost:3000/api/payments/mercadopago/webhook?type=payment&data.id=123",
      {
        method: "POST",
      },
    );

    const response = await POST(request);

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      success: false,
      message: "No se pudo procesar el webhook de Mercado Pago.",
      data: null,
    });
  });

  it("reads body and legacy query params when present", async () => {
    processMercadoPagoWebhookMock.mockResolvedValue({
      success: true,
      status: 202,
      message: "ok",
      data: null,
    });

    const request = new Request(
      "http://localhost:3000/api/payments/mercadopago/webhook?topic=payment&id=123",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          type: "payment",
          data: {
            id: "123",
          },
        }),
      },
    );

    await POST(request);

    expect(processMercadoPagoWebhookMock).toHaveBeenCalledWith({
      bodyDataId: "123",
      bodyType: "payment",
      topic: "payment",
      type: null,
      dataId: null,
      legacyId: "123",
      xSignature: null,
      xRequestId: null,
    });
  });
});
