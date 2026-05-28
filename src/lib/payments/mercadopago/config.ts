type MercadoPagoCheckoutUrls = {
  success: string;
  pending: string;
  failure: string;
  webhook: string;
};

type MercadoPagoConfig = {
  accessToken: string;
  webhookSecret: string | null;
  apiBaseUrl: string;
  checkoutUrls: MercadoPagoCheckoutUrls;
};

function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getMercadoPagoAccessToken() {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN?.trim();

  if (!accessToken) {
    throw new Error(
      "Falta configurar MERCADO_PAGO_ACCESS_TOKEN en el entorno para operar con Mercado Pago.",
    );
  }

  return accessToken;
}

export function getMercadoPagoWebhookSecret() {
  const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET?.trim();

  if (!webhookSecret) {
    throw new Error(
      "Falta configurar MERCADO_PAGO_WEBHOOK_SECRET en el entorno para validar la firma del webhook de Mercado Pago.",
    );
  }

  return webhookSecret;
}

export function getMercadoPagoConfig(): MercadoPagoConfig {
  const accessToken = getMercadoPagoAccessToken();
  const siteUrl = process.env.NEXTAUTH_URL?.trim();

  if (!siteUrl) {
    throw new Error(
      "Falta configurar NEXTAUTH_URL en el entorno para construir las back_urls de Mercado Pago.",
    );
  }

  const baseUrl = trimTrailingSlash(siteUrl);

  return {
    accessToken,
    webhookSecret: process.env.MERCADO_PAGO_WEBHOOK_SECRET?.trim() ?? null,
    apiBaseUrl: "https://api.mercadopago.com",
    checkoutUrls: {
      success: `${baseUrl}/checkout/success`,
      pending: `${baseUrl}/checkout/pending`,
      failure: `${baseUrl}/checkout/failure`,
      webhook: `${baseUrl}/api/payments/mercadopago/webhook`,
    },
  };
}
