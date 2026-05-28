import { z } from "zod";

type ValidationResult =
  | {
      success: true;
      data: VerifyEmailInput;
    }
  | {
      success: false;
      errors: Record<string, string>;
    };

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export const verifyEmailInputSchema = z.object({
  token: z.string().min(1, "El enlace no es valido o expiro."),
});

export type VerifyEmailInput = z.output<typeof verifyEmailInputSchema>;

export function validateVerifyEmailInput(input: unknown): ValidationResult {
  const raw =
    typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};

  const normalizedInput = {
    token: normalizeString(raw.token),
  };

  const result = verifyEmailInputSchema.safeParse(normalizedInput);

  if (!result.success) {
    const errors: Record<string, string> = {};

    for (const issue of result.error.issues) {
      const field = issue.path[0];

      if (typeof field === "string") {
        errors[field] = issue.message;
      }
    }

    return {
      success: false,
      errors,
    };
  }

  return {
    success: true,
    data: result.data,
  };
}
