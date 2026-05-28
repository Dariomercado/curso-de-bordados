import { beforeEach, describe, expect, it, vi } from "vitest";

const { createContactLeadMock } = vi.hoisted(() => ({
  createContactLeadMock: vi.fn(),
}));

vi.mock("@/server/repositories/contact-lead-repository", () => ({
  createContactLead: createContactLeadMock,
}));

import { createContactLeadFromInput } from "@/server/use-cases/create-contact-lead";

describe("createContactLeadFromInput", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a 400 result and does not persist when validation fails", async () => {
    const result = await createContactLeadFromInput({
      name: "",
      email: "invalido",
      message: "corto",
    });

    expect(createContactLeadMock).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      status: 400,
      errors: {
        name: "Ingresa tu nombre.",
        email: "Ingresa un email valido.",
        message: "El mensaje debe tener al menos 10 caracteres.",
      },
      message: "Revisa los datos del formulario.",
    });
  });

  it("persists the normalized lead and returns a 201 result when validation passes", async () => {
    createContactLeadMock.mockResolvedValue({ id: "lead-1" });

    const result = await createContactLeadFromInput({
      name: "  Susana  ",
      email: "  SUSANA@email.com ",
      phone: " 11 4444 4444 ",
      message: "  Quiero consultar por los cursos disponibles. ",
      source: " contact-page ",
    });

    expect(createContactLeadMock).toHaveBeenCalledTimes(1);
    expect(createContactLeadMock).toHaveBeenCalledWith({
      name: "Susana",
      email: "susana@email.com",
      phone: "11 4444 4444",
      message: "Quiero consultar por los cursos disponibles.",
      source: "contact-page",
    });
    expect(result).toEqual({
      success: true,
      status: 201,
      message: "Consulta enviada correctamente.",
    });
  });
});
