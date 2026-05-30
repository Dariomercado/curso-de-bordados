import { NextResponse } from "next/server";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/http/rate-limit";
import { getRequestOrigin } from "@/lib/http/request-origin";
import { isDevConsolePreviewEnabled } from "@/server/email/is-dev-console-preview-enabled";
import { sendPasswordReset } from "@/server/use-cases/auth/send-password-reset";

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
      keyPrefix: "auth:password-forgot",
      limit: 5,
      windowMs: 15 * 60 * 1000,
      identifiers: [email],
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          message: "Si el email existe, te enviamos instrucciones para restablecer tu contrasena.",
        },
        { status: 200, headers: getRateLimitHeaders(rateLimit) },
      );
    }

    const result = await sendPasswordReset({
      ...body,
      origin: getRequestOrigin(request),
    });

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
        ...(isDevConsolePreviewEnabled() && result.data?.devPreviewResetUrl
          ? {
              devPreview: {
                resetUrl: result.data.devPreviewResetUrl,
              },
            }
          : {}),
      },
      { status: result.status },
    );
  } catch {
    return NextResponse.json(
      {
        message: "No se pudo procesar la solicitud. Intenta nuevamente.",
      },
      { status: 500 },
    );
  }
}
