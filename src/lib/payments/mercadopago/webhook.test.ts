import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/payments/mercadopago/config", () => ({
  getMercadoPagoWebhookSecret: vi.fn(),
}));

import { getMercadoPagoWebhookSecret } from "@/lib/payments/mercadopago/config";
import { validateMercadoPagoWebhookSignature } from "@/lib/payments/mercadopago/webhook";

const getMercadoPagoWebhookSecretMock = vi.mocked(getMercadoPagoWebhookSecret);

describe("validateMercadoPagoWebhookSignature", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getMercadoPagoWebhookSecretMock.mockReturnValue("super-secret");
  });

  it("validates the signature using data.id and x-request-id", () => {
    const timestamp = String(Date.now());
    const manifest = `id:123456;request-id:req-1;ts:${timestamp};`;
    const hash = createHmac("sha256", "super-secret")
      .update(manifest)
      .digest("hex");

    expect(
      validateMercadoPagoWebhookSignature({
        dataId: "123456",
        xSignature: `ts=${timestamp},v1=${hash}`,
        xRequestId: "req-1",
      }),
    ).toBe(true);
  });

  it("uses data.id exactly as received in the manifest", () => {
    const timestamp = String(Date.now());
    const manifest = `id:ABC123;request-id:req-1;ts:${timestamp};`;
    const hash = createHmac("sha256", "super-secret")
      .update(manifest)
      .digest("hex");

    expect(
      validateMercadoPagoWebhookSignature({
        dataId: "ABC123",
        xSignature: `ts=${timestamp},v1=${hash}`,
        xRequestId: "req-1",
      }),
    ).toBe(true);
  });

  it("returns false when the signature timestamp is stale", () => {
    const timestamp = String(Date.now() - 11 * 60 * 1000);
    const manifest = `id:123456;request-id:req-1;ts:${timestamp};`;
    const hash = createHmac("sha256", "super-secret")
      .update(manifest)
      .digest("hex");

    expect(
      validateMercadoPagoWebhookSignature({
        dataId: "123456",
        xSignature: `ts=${timestamp},v1=${hash}`,
        xRequestId: "req-1",
      }),
    ).toBe(false);
  });

  it("returns false when x-signature is missing", () => {
    expect(
      validateMercadoPagoWebhookSignature({
        dataId: "123456",
        xSignature: null,
        xRequestId: "req-1",
      }),
    ).toBe(false);
  });

  it("returns false when x-request-id is missing", () => {
    expect(
      validateMercadoPagoWebhookSignature({
        dataId: "123456",
        xSignature: "ts=1742505638683,v1=abc",
        xRequestId: null,
      }),
    ).toBe(false);
  });

  it("returns false when data.id is missing", () => {
    expect(
      validateMercadoPagoWebhookSignature({
        dataId: null,
        xSignature: "ts=1742505638683,v1=abc",
        xRequestId: "req-1",
      }),
    ).toBe(false);
  });
});
