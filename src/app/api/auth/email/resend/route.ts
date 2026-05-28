import { NextResponse } from "next/server";
import { getRequestOrigin } from "@/lib/http/request-origin";
import { resendEmailVerification } from "@/server/use-cases/auth/resend-email-verification";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await resendEmailVerification({
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
