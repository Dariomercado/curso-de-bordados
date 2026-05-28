import { z } from "zod";

type ValidationResult<TData> =
  | {
      success: true;
      data: TData;
    }
  | {
      success: false;
      errors: Record<string, string>;
    };

const assignCourseToUserSchema = z.object({
  userId: z.string().min(1, "Selecciona un usuario."),
  courseId: z.string().min(1, "Selecciona un curso."),
});

const revokeCourseAccessSchema = z.object({
  id: z.string().min(1, "El acceso es obligatorio."),
});

export type AssignCourseToUserInput = z.output<typeof assignCourseToUserSchema>;
export type RevokeCourseAccessInput = z.output<typeof revokeCourseAccessSchema>;

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function buildValidationErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === "string") {
      errors[field] = issue.message;
    }
  }

  return errors;
}

export function validateAssignCourseToUserInput(
  input: unknown,
): ValidationResult<AssignCourseToUserInput> {
  const raw =
    typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};

  const normalizedInput = {
    userId: normalizeString(raw.userId),
    courseId: normalizeString(raw.courseId),
  };

  const result = assignCourseToUserSchema.safeParse(normalizedInput);

  if (!result.success) {
    return {
      success: false,
      errors: buildValidationErrors(result.error),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

export function validateRevokeCourseAccessInput(
  input: unknown,
): ValidationResult<RevokeCourseAccessInput> {
  const raw =
    typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};

  const normalizedInput = {
    id: normalizeString(raw.id),
  };

  const result = revokeCourseAccessSchema.safeParse(normalizedInput);

  if (!result.success) {
    return {
      success: false,
      errors: buildValidationErrors(result.error),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}
