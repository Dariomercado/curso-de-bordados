import { NextResponse } from "next/server";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/http/rate-limit";
import { resetPassword } from "@/server/use-cases/auth/reset-password";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token =
      typeof body === "object" &&
      body !== null &&
      "token" in body &&
      typeof body.token === "string"
        ? body.token.slice(0, 24)
        : null;
    const rateLimit = checkRateLimit(request, {
      keyPrefix: "auth:password-reset",
      limit: 8,
      windowMs: 15 * 60 * 1000,
      identifiers: [token],
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          message: "Demasiados intentos. Intenta nuevamente en unos minutos.",
        },
        { status: 429, headers: getRateLimitHeaders(rateLimit) },
      );
    }

    const result = await resetPassword(body);

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
        message: "No se pudo restablecer la contrasena. Intenta nuevamente.",
      },
      { status: 500 },
    );
  }
}
