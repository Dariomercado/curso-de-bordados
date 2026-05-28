import { NextResponse } from "next/server";
import { processMercadoPagoWebhook } from "@/server/use-cases/process-mercadopago-webhook";

export async function POST(request: Request) {
  const url = new URL(request.url);
  let bodyType: string | null = null;
  let bodyDataId: string | null = null;

  try {
    const body = (await request.clone().json()) as {
      type?: string;
      data?: { id?: string };
    };

    bodyType = body.type ?? null;
    bodyDataId = body.data?.id ?? null;
  } catch {
    bodyType = null;
    bodyDataId = null;
  }

  try {
    const result = await processMercadoPagoWebhook({
      topic: url.searchParams.get("topic"),
      type: url.searchParams.get("type"),
      dataId: url.searchParams.get("data.id"),
      legacyId: url.searchParams.get("id"),
      bodyType,
      bodyDataId,
      xSignature: request.headers.get("x-signature"),
      xRequestId: request.headers.get("x-request-id"),
    });

    return NextResponse.json(
      {
        success: result.success,
        message: result.message,
        data: result.success ? result.data : null,
        errors: result.success ? undefined : result.errors,
      },
      { status: result.status },
    );
  } catch (error) {
    console.error("[mercadopago] Webhook route failed", {
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "No se pudo procesar el webhook de Mercado Pago.",
        data: null,
      },
      { status: 500 },
    );
  }
}
