import { z } from "zod";

type ValidationResult =
  | {
      success: true;
      data: RegisterInput;
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

export const registerInputSchema = z.object({
  name: z
    .string()
    .min(2, "Ingresa tu nombre.")
    .max(120, "El nombre es demasiado largo."),
  email: z
    .string()
    .min(1, "Ingresa tu email.")
    .max(160, "El email es demasiado largo.")
    .refine(isValidEmail, "Ingresa un email valido."),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .max(72, "La contraseña es demasiado larga."),
});

export type RegisterInput = z.output<typeof registerInputSchema>;

export function validateRegisterInput(input: unknown): ValidationResult {
  const raw =
    typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};

  const normalizedInput = {
    name: normalizeString(raw.name),
    email: normalizeString(raw.email).toLowerCase(),
    password: typeof raw.password === "string" ? raw.password : "",
  };

  const result = registerInputSchema.safeParse(normalizedInput);

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
