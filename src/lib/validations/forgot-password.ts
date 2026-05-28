import { z } from "zod";

type ValidationResult =
  | {
      success: true;
      data: ForgotPasswordInput;
    }
  | {
      success: false;
      errors: Record<string, string>;
    };

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export const forgotPasswordInputSchema = z.object({
  email: z
    .string()
    .min(1, "Ingresa tu email.")
    .max(160, "El email es demasiado largo.")
    .refine(isValidEmail, "Ingresa un email valido."),
});

export type ForgotPasswordInput = z.output<typeof forgotPasswordInputSchema>;

export function validateForgotPasswordInput(input: unknown): ValidationResult {
  const raw =
    typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};

  const normalizedInput = {
    email: normalizeString(raw.email).toLowerCase(),
  };

  const result = forgotPasswordInputSchema.safeParse(normalizedInput);

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
