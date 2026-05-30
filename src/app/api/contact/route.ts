import { NextResponse } from "next/server";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/http/rate-limit";
import { createContactLeadFromInput } from "@/server/use-cases/create-contact-lead";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email =
      typeof body === "object" &&
      body !== null &&
      "email" in body &&
      typeof body.email === "string"
        ? body.email
        : null;
    const rateLimit = checkRateLimit(request, {
      keyPrefix: "contact",
      limit: 5,
      windowMs: 15 * 60 * 1000,
      identifiers: [email],
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          message: "Demasiados intentos. Intenta nuevamente en unos minutos.",
        },
        { status: 429, headers: getRateLimitHeaders(rateLimit) },
      );
    }

    const result = await createContactLeadFromInput(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: result.message,
          errors: result.errors,
        },
        { status: result.status },
      );
    }

    return NextResponse.json(
      {
        message: result.message,
      },
      { status: result.status },
    );
  } catch {
    return NextResponse.json(
      {
        message: "No se pudo procesar la consulta. Intenta nuevamente.",
      },
      { status: 500 },
    );
  }
}
