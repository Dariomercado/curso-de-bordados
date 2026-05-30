import { NextResponse } from "next/server";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/http/rate-limit";
import { startCourseCheckout } from "@/server/use-cases/start-course-checkout";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "No se pudo procesar la solicitud.",
        data: null,
      },
      { status: 400 },
    );
  }

  try {
    const buyerEmail =
      typeof body === "object" &&
      body !== null &&
      "buyerEmail" in body &&
      typeof body.buyerEmail === "string"
        ? body.buyerEmail
        : null;
    const rateLimit = checkRateLimit(request, {
      keyPrefix: "payments:mercadopago:checkout",
      limit: 5,
      windowMs: 15 * 60 * 1000,
      identifiers: [buyerEmail],
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Demasiados intentos. Intenta nuevamente en unos minutos.",
          data: null,
        },
        { status: 429, headers: getRateLimitHeaders(rateLimit) },
      );
    }

    const result = await startCourseCheckout(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          errors: result.errors,
          data: null,
        },
        { status: result.status },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        data: result.data,
      },
      { status: result.status },
    );
  } catch (error) {
    console.error("[mercadopago] Checkout route failed", {
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        message: "No se pudo iniciar la compra.",
        data: null,
      },
      { status: 500 },
    );
  }
}
