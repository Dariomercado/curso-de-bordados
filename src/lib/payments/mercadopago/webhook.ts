import { createHmac, timingSafeEqual } from "node:crypto";
import { getMercadoPagoWebhookSecret } from "@/lib/payments/mercadopago/config";

type ValidateMercadoPagoWebhookSignatureInput = {
  dataId?: string | null;
  xSignature: string | null;
  xRequestId: string | null;
};

function parseSignatureHeader(value: string | null) {
  if (!value) {
    return null;
  }

  const parts = value.split(",");
  const parsed = new Map<string, string>();

  for (const part of parts) {
    const [rawKey, rawValue] = part.split("=", 2);

    if (!rawKey || !rawValue) {
      continue;
    }

    parsed.set(rawKey.trim(), rawValue.trim());
  }

  const ts = parsed.get("ts");
  const hash = parsed.get("v1");

  if (!ts || !hash) {
    return null;
  }

  return {
    ts,
    hash,
  };
}

function buildManifest(input: {
  dataId?: string | null;
  xRequestId?: string | null;
  timestamp: string;
}) {
  return `id:${input.dataId ?? ""};request-id:${input.xRequestId ?? ""};ts:${input.timestamp};`;
}

function maskValue(value: string) {
  if (value.length <= 12) {
    return `${value.slice(0, 4)}...${value.slice(-2)}`;
  }

  return `${value.slice(0, 8)}...${value.slice(-8)}`;
}

export function validateMercadoPagoWebhookSignature(
  input: ValidateMercadoPagoWebhookSignatureInput,
) {
  if (!input.dataId || !input.xSignature || !input.xRequestId) {
    return false;
  }

  const secret = getMercadoPagoWebhookSecret();
  const parsedSignature = parseSignatureHeader(input.xSignature);

  if (!parsedSignature) {
    return false;
  }

  const manifest = buildManifest({
    dataId: input.dataId,
    xRequestId: input.xRequestId,
    timestamp: parsedSignature.ts,
  });

  const expectedHash = createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  if (process.env.NODE_ENV !== "production") {
    console.info("[mercadopago] Webhook signature debug", {
      manifest,
      expectedHashMasked: maskValue(expectedHash),
      receivedHashMasked: maskValue(parsedSignature.hash),
    });
  }

  const expected = Buffer.from(expectedHash, "hex");
  const received = Buffer.from(parsedSignature.hash, "hex");

  if (expected.length !== received.length) {
    return false;
  }

  return timingSafeEqual(expected, received);
}
