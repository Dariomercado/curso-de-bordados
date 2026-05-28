import { z } from "zod";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const loginInputSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Ingresa tu email.")
    .transform((value) => value.toLowerCase())
    .refine(isValidEmail, "Ingresa un email valido."),
  password: z.string().min(1, "Ingresa tu contraseña."),
});

export type LoginInput = z.output<typeof loginInputSchema>;
