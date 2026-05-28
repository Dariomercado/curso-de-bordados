import { NextResponse } from "next/server";
import { createContactLeadFromInput } from "@/server/use-cases/create-contact-lead";

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
