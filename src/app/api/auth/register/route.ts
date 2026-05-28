import { NextResponse } from "next/server";
import { getRequestOrigin } from "@/lib/http/request-origin";
import { isDevConsolePreviewEnabled } from "@/server/email/is-dev-console-preview-enabled";
import { registerStudent } from "@/server/use-cases/auth/register-student";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await registerStudent({
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
        ...(isDevConsolePreviewEnabled() && result.data.devPreviewVerificationUrl
          ? {
              devPreview: {
                verificationUrl: result.data.devPreviewVerificationUrl,
              },
            }
          : {}),
      },
      { status: result.status },
    );
  } catch {
    return NextResponse.json(
      {
        message: "No se pudo procesar el registro. Intenta nuevamente.",
      },
      { status: 500 },
    );
  }
}
