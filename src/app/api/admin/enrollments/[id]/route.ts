import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/guards";
import { revokeCourseAccess } from "@/server/use-cases/revoke-course-access";

type RevokeEnrollmentRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  _request: Request,
  context: RevokeEnrollmentRouteContext,
) {
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

  try {
    const { id } = await context.params;
    const result = await revokeCourseAccess({ id });

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
        message: "No se pudo revocar el acceso.",
      },
      { status: 500 },
    );
  }
}
