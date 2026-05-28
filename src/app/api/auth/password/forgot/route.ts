import { NextResponse } from "next/server";
import { getRequestOrigin } from "@/lib/http/request-origin";
import { isDevConsolePreviewEnabled } from "@/server/email/is-dev-console-preview-enabled";
import { sendPasswordReset } from "@/server/use-cases/auth/send-password-reset";

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
