import { z } from "zod";

type ValidationResult =
  | {
      success: true;
      data: ResetPasswordInput;
    }
  | {
      success: false;
      errors: Record<string, string>;
    };

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export const resetPasswordInputSchema = z
  .object({
    token: z.string().min(1, "El enlace no es valido o expiro."),
    password: z
      .string()
      .min(8, "La contrasena debe tener al menos 8 caracteres.")
      .max(72, "La contrasena es demasiado larga."),
    confirmPassword: z
      .string()
      .min(1, "Confirma tu nueva contrasena."),
  })
  .refine((input) => input.password === input.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contrasenas no coinciden.",
  });

export type ResetPasswordInput = z.output<typeof resetPasswordInputSchema>;

export function validateResetPasswordInput(input: unknown): ValidationResult {
  const raw =
    typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};

  const normalizedInput = {
    token: normalizeString(raw.token),
    password: typeof raw.password === "string" ? raw.password : "",
    confirmPassword: typeof raw.confirmPassword === "string" ? raw.confirmPassword : "",
  };

  const result = resetPasswordInputSchema.safeParse(normalizedInput);

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
