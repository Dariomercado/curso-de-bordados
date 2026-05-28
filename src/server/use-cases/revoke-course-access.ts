import {
  validateRevokeCourseAccessInput,
  type RevokeCourseAccessInput,
} from "@/lib/validations/admin-enrollment";
import {
  deleteEnrollmentById,
  findEnrollmentById,
} from "@/server/repositories/enrollment-repository";
import type { UseCaseResult } from "@/server/use-cases/use-case-result";

export async function revokeCourseAccess(
  input: unknown,
): Promise<UseCaseResult<null>> {
  const validationResult = validateRevokeCourseAccessInput(input);

  if (!validationResult.success) {
    return {
      success: false,
      status: 400,
      message: "No se pudo revocar el acceso.",
      errors: validationResult.errors,
    };
  }

  return revokeValidatedCourseAccess(validationResult.data);
}

async function revokeValidatedCourseAccess(
  input: RevokeCourseAccessInput,
): Promise<UseCaseResult<null>> {
  const enrollment = await findEnrollmentById(input.id);

  if (!enrollment) {
    return {
      success: false,
      status: 404,
      message: "El acceso no existe.",
    };
  }

  try {
    await deleteEnrollmentById(input.id);
  } catch {
    return {
      success: false,
      status: 500,
      message: "No se pudo revocar el acceso.",
    };
  }

  return {
    success: true,
    status: 200,
    message: "Acceso revocado correctamente.",
    data: null,
  };
}
