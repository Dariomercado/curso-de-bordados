import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/guards";
import { assignCourseToUser } from "@/server/use-cases/assign-course-to-user";

export async function POST(request: Request) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        success: false,
        message: "Debes iniciar sesion para continuar.",
      },
      { status: 401 },
    );
  }

  if (session.user.role !== UserRole.ADMIN) {
    return NextResponse.json(
      {
        success: false,
        message: "No tienes permisos para realizar esta accion.",
      },
      { status: 403 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "No se pudo procesar la solicitud.",
      },
      { status: 400 },
    );
  }

  try {
    const result = await assignCourseToUser(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          errors: result.errors,
        },
        { status: result.status },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
      },
      { status: result.status },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "No se pudo asignar el acceso.",
      },
      { status: 500 },
    );
  }
}
