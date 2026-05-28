import {
  getMercadoPagoAccessToken,
  getMercadoPagoConfig,
} from "@/lib/payments/mercadopago/config";

type CreateCheckoutPreferenceInput = {
  externalReference: string;
  buyerEmail: string;
  item: {
    id: string;
    title: string;
    unitPrice: number;
    quantity: number;
  };
};

type CreateCheckoutPreferenceResult = {
  preferenceId: string;
  initPoint: string | null;
  sandboxInitPoint: string | null;
};

type MercadoPagoPreferenceResponse = {
  id?: unknown;
  init_point?: unknown;
  sandbox_init_point?: unknown;
  message?: unknown;
  error?: unknown;
  cause?: unknown;
};

type MercadoPagoPaymentResponse = {
  id?: unknown;
  status?: unknown;
  status_detail?: unknown;
  external_reference?: unknown;
  currency_id?: unknown;
  transaction_amount?: unknown;
  date_approved?: unknown;
  payer?: {
    email?: unknown;
  } | null;
  message?: unknown;
  error?: unknown;
  cause?: unknown;
};

type MercadoPagoMerchantOrderResponse = {
  id?: unknown;
  status?: unknown;
  order_status?: unknown;
  external_reference?: unknown;
  total_amount?: unknown;
  paid_amount?: unknown;
  payments?: unknown;
  message?: unknown;
  error?: unknown;
  cause?: unknown;
};

export type MercadoPagoPayment = {
  id: string;
  status: string | null;
  statusDetail: string | null;
  externalReference: string | null;
  currencyId: string | null;
  transactionAmount: number | null;
  payerEmail: string | null;
  dateApproved: string | null;
};

export type MercadoPagoMerchantOrderPayment = {
  id: string;
  status: string | null;
  transactionAmount: number | null;
};

export type MercadoPagoMerchantOrder = {
  id: string;
  status: string | null;
  orderStatus: string | null;
  externalReference: string | null;
  totalAmount: number | null;
  paidAmount: number | null;
  payments: MercadoPagoMerchantOrderPayment[];
};

export async function createCheckoutPreference(
  input: CreateCheckoutPreferenceInput,
): Promise<CreateCheckoutPreferenceResult> {
  const config = getMercadoPagoConfig();

  console.info("[mercadopago] Creating checkout preference", {
    externalReference: input.externalReference,
    buyerEmail: input.buyerEmail,
    itemId: input.item.id,
    quantity: input.item.quantity,
    currencyId: "ARS",
  });

  const response = await fetch(`${config.apiBaseUrl}/checkout/preferences`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        {
          id: input.item.id,
          title: input.item.title,
          quantity: input.item.quantity,
          currency_id: "ARS",
          unit_price: input.item.unitPrice,
        },
      ],
      payer: {
        email: input.buyerEmail,
      },
      external_reference: input.externalReference,
      back_urls: {
        success: config.checkoutUrls.success,
        pending: config.checkoutUrls.pending,
        failure: config.checkoutUrls.failure,
      },
      notification_url: config.checkoutUrls.webhook,
      auto_return: "approved",
    }),
  });

  if (!response.ok) {
    let errorBody: MercadoPagoPreferenceResponse | null = null;

    try {
      errorBody = (await response.json()) as MercadoPagoPreferenceResponse;
    } catch {
      errorBody = null;
    }

    console.error("[mercadopago] Preference creation failed", {
      externalReference: input.externalReference,
      status: response.status,
      statusText: response.statusText,
      error: errorBody?.error,
      message: errorBody?.message,
      cause: errorBody?.cause,
    });

    const errorMessage =
      typeof errorBody?.message === "string" && errorBody.message.length > 0
        ? errorBody.message
        : `Mercado Pago devolvio status ${response.status}.`;

    throw new Error(`No se pudo crear la preferencia de Mercado Pago: ${errorMessage}`);
  }

  const data = (await response.json()) as MercadoPagoPreferenceResponse;

  if (typeof data.id !== "string" || data.id.length === 0) {
    throw new Error("Mercado Pago did not return a valid preference id.");
  }

  const initPoint = typeof data.init_point === "string" ? data.init_point : null;
  const sandboxInitPoint =
    typeof data.sandbox_init_point === "string" ? data.sandbox_init_point : null;

  console.info("[mercadopago] Preference created", {
    externalReference: input.externalReference,
    preferenceId: data.id,
    hasInitPoint: Boolean(initPoint),
    hasSandboxInitPoint: Boolean(sandboxInitPoint),
  });

  return {
    preferenceId: data.id,
    initPoint,
    sandboxInitPoint,
  };
}

export async function getPaymentById(paymentId: string): Promise<MercadoPagoPayment> {
  const accessToken = getMercadoPagoAccessToken();

  console.info("[mercadopago] Fetching payment", {
    paymentId,
  });

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    let errorBody: MercadoPagoPaymentResponse | null = null;

    try {
      errorBody = (await response.json()) as MercadoPagoPaymentResponse;
    } catch {
      errorBody = null;
    }

    console.error("[mercadopago] Payment fetch failed", {
      paymentId,
      status: response.status,
      statusText: response.statusText,
      error: errorBody?.error,
      message: errorBody?.message,
      cause: errorBody?.cause,
    });

    const errorMessage =
      typeof errorBody?.message === "string" && errorBody.message.length > 0
        ? errorBody.message
        : `Mercado Pago devolvio status ${response.status}.`;

    throw new Error(`No se pudo consultar el pago de Mercado Pago: ${errorMessage}`);
  }

  const data = (await response.json()) as MercadoPagoPaymentResponse;

  if (typeof data.id !== "number" && typeof data.id !== "string") {
    throw new Error("Mercado Pago no devolvio un payment id valido.");
  }

  const payment = {
    id: String(data.id),
    status: typeof data.status === "string" ? data.status : null,
    statusDetail: typeof data.status_detail === "string" ? data.status_detail : null,
    externalReference:
      typeof data.external_reference === "string" ? data.external_reference : null,
    currencyId: typeof data.currency_id === "string" ? data.currency_id : null,
    transactionAmount:
      typeof data.transaction_amount === "number" ? data.transaction_amount : null,
    payerEmail:
      data.payer && typeof data.payer.email === "string" ? data.payer.email : null,
    dateApproved: typeof data.date_approved === "string" ? data.date_approved : null,
  } satisfies MercadoPagoPayment;

  console.info("[mercadopago] Payment fetched", {
    paymentId: payment.id,
    status: payment.status,
    externalReference: payment.externalReference,
  });

  return payment;
}

export async function getMerchantOrderById(
  merchantOrderId: string,
): Promise<MercadoPagoMerchantOrder> {
  const accessToken = getMercadoPagoAccessToken();

  console.info("[mercadopago] Fetching merchant order", {
    merchantOrderId,
  });

  const response = await fetch(
    `https://api.mercadopago.com/merchant_orders/${merchantOrderId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    let errorBody: MercadoPagoMerchantOrderResponse | null = null;

    try {
      errorBody = (await response.json()) as MercadoPagoMerchantOrderResponse;
    } catch {
      errorBody = null;
    }

    console.error("[mercadopago] Merchant order fetch failed", {
      merchantOrderId,
      status: response.status,
      statusText: response.statusText,
      error: errorBody?.error,
      message: errorBody?.message,
      cause: errorBody?.cause,
    });

    const errorMessage =
      typeof errorBody?.message === "string" && errorBody.message.length > 0
        ? errorBody.message
        : `Mercado Pago devolvio status ${response.status}.`;

    throw new Error(
      `No se pudo consultar la merchant order de Mercado Pago: ${errorMessage}`,
    );
  }

  const data = (await response.json()) as MercadoPagoMerchantOrderResponse;

  if (typeof data.id !== "number" && typeof data.id !== "string") {
    throw new Error("Mercado Pago no devolvio un merchant order id valido.");
  }

  const rawPayments = Array.isArray(data.payments) ? data.payments : [];

  const merchantOrder = {
    id: String(data.id),
    status: typeof data.status === "string" ? data.status : null,
    orderStatus: typeof data.order_status === "string" ? data.order_status : null,
    externalReference:
      typeof data.external_reference === "string" ? data.external_reference : null,
    totalAmount: typeof data.total_amount === "number" ? data.total_amount : null,
    paidAmount: typeof data.paid_amount === "number" ? data.paid_amount : null,
    payments: rawPayments.flatMap((payment) => {
      if (!payment || typeof payment !== "object") {
        return [];
      }

      const candidate = payment as {
        id?: unknown;
        status?: unknown;
        transaction_amount?: unknown;
      };

      if (typeof candidate.id !== "number" && typeof candidate.id !== "string") {
        return [];
      }

      return [
        {
          id: String(candidate.id),
          status: typeof candidate.status === "string" ? candidate.status : null,
          transactionAmount:
            typeof candidate.transaction_amount === "number"
              ? candidate.transaction_amount
              : null,
        } satisfies MercadoPagoMerchantOrderPayment,
      ];
    }),
  } satisfies MercadoPagoMerchantOrder;

  console.info("[mercadopago] Merchant order fetched", {
    merchantOrderId: merchantOrder.id,
    status: merchantOrder.status,
    orderStatus: merchantOrder.orderStatus,
    externalReference: merchantOrder.externalReference,
    paymentsCount: merchantOrder.payments.length,
  });

  return merchantOrder;
}
