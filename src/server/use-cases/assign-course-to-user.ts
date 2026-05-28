import {
  validateAssignCourseToUserInput,
  type AssignCourseToUserInput,
} from "@/lib/validations/admin-enrollment";
import {
  createEnrollment,
  findEnrollmentByUserIdAndCourseId,
  findPublishedCourseById,
  findUserById,
} from "@/server/repositories/enrollment-repository";
import type { UseCaseResult } from "@/server/use-cases/use-case-result";

export async function assignCourseToUser(
  input: unknown,
): Promise<UseCaseResult<null>> {
  const validationResult = validateAssignCourseToUserInput(input);

  if (!validationResult.success) {
    return {
      success: false,
      status: 400,
      message: "No se pudo asignar el acceso.",
      errors: validationResult.errors,
    };
  }

  return assignValidatedCourseToUser(validationResult.data);
}

async function assignValidatedCourseToUser(
  input: AssignCourseToUserInput,
): Promise<UseCaseResult<null>> {
  const [user, course, existingEnrollment] = await Promise.all([
    findUserById(input.userId),
    findPublishedCourseById(input.courseId),
    findEnrollmentByUserIdAndCourseId(input.userId, input.courseId),
  ]);

  if (!user) {
    return {
      success: false,
      status: 400,
      message: "No se pudo asignar el acceso.",
      errors: {
        userId: "El usuario seleccionado no existe.",
      },
    };
  }

  if (!course) {
    return {
      success: false,
      status: 400,
      message: "No se pudo asignar el acceso.",
      errors: {
        courseId: "El curso seleccionado no existe o no esta publicado.",
      },
    };
  }

  if (existingEnrollment) {
    return {
      success: false,
      status: 400,
      message: "No se pudo asignar el acceso.",
      errors: {
        courseId: "Este curso ya esta asignado a este usuario.",
      },
    };
  }

  await createEnrollment(input.userId, input.courseId);

  return {
    success: true,
    status: 201,
    message: "Acceso asignado correctamente.",
    data: null,
  };
}
