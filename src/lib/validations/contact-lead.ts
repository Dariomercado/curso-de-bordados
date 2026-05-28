import { z } from "zod";

type ValidationResult =
  | {
      success: true;
      data: ContactLeadInput;
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

const contactLeadSchema = z
  .object({
    name: z
      .string()
      .min(2, "Ingresa tu nombre.")
      .max(120, "El nombre es demasiado largo."),
    email: z
      .string()
      .refine(isValidEmail, "Ingresa un email valido.")
      .max(160, "El email es demasiado largo."),
    phone: z.string().max(40, "El telefono es demasiado largo."),
    message: z
      .string()
      .min(10, "El mensaje debe tener al menos 10 caracteres.")
      .max(2000, "El mensaje es demasiado largo."),
    source: z.string().max(80, "La referencia de origen es demasiado larga."),
  })
  .transform((data) => ({
    name: data.name,
    email: data.email,
    phone: data.phone || undefined,
    message: data.message,
    source: data.source || undefined,
  }));

export type ContactLeadInput = z.output<typeof contactLeadSchema>;

export function validateContactLeadInput(input: unknown): ValidationResult {
  const raw =
    typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};

  const normalizedInput = {
    name: normalizeString(raw.name),
    email: normalizeString(raw.email).toLowerCase(),
    phone: normalizeString(raw.phone),
    message: normalizeString(raw.message),
    source: normalizeString(raw.source),
  };

  const result = contactLeadSchema.safeParse(normalizedInput);

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
