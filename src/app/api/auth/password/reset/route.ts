import { NextResponse } from "next/server";
import { resetPassword } from "@/server/use-cases/auth/reset-password";

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
