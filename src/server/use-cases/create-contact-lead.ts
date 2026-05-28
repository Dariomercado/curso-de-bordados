import { validateContactLeadInput } from "@/lib/validations/contact-lead";
import { createContactLead } from "@/server/repositories/contact-lead-repository";

export async function createContactLeadFromInput(input: unknown) {
  const result = validateContactLeadInput(input);

  if (!result.success) {
    return {
      success: false as const,
      status: 400,
      errors: result.errors,
      message: "Revisa los datos del formulario.",
    };
  }

  await createContactLead(result.data);

  return {
    success: true as const,
    status: 201,
    message: "Consulta enviada correctamente.",
  };
}
