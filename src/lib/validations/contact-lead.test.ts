import { describe, expect, it } from "vitest";
import { validateContactLeadInput } from "@/lib/validations/contact-lead";

describe("validateContactLeadInput", () => {
  it("returns normalized data when the input is valid", () => {
    const result = validateContactLeadInput({
      name: "  Susana  ",
      email: "  HOLA@EMAIL.COM  ",
      phone: "  11 5555 5555  ",
      message: "  Quiero mas informacion sobre los cursos.  ",
      source: "  contact-page  ",
    });

    expect(result).toEqual({
      success: true,
      data: {
        name: "Susana",
        email: "hola@email.com",
        phone: "11 5555 5555",
        message: "Quiero mas informacion sobre los cursos.",
        source: "contact-page",
      },
    });
  });

  it("returns undefined for optional empty fields after normalization", () => {
    const result = validateContactLeadInput({
      name: "Susana",
      email: "susana@email.com",
      phone: "   ",
      message: "Mensaje suficientemente largo.",
      source: "   ",
    });

    expect(result).toEqual({
      success: true,
      data: {
        name: "Susana",
        email: "susana@email.com",
        phone: undefined,
        message: "Mensaje suficientemente largo.",
        source: undefined,
      },
    });
  });

  it("returns field errors when the input is invalid", () => {
    const result = validateContactLeadInput({
      name: "A",
      email: "email-invalido",
      phone: "1".repeat(41),
      message: "Corto",
      source: "s".repeat(81),
    });

    expect(result).toEqual({
      success: false,
      errors: {
        name: "Ingresa tu nombre.",
        email: "Ingresa un email valido.",
        phone: "El telefono es demasiado largo.",
        message: "El mensaje debe tener al menos 10 caracteres.",
        source: "La referencia de origen es demasiado larga.",
      },
    });
  });

  it("prioritizes max length errors over min length errors for the same field", () => {
    const result = validateContactLeadInput({
      name: "n".repeat(121),
      email: `${"e".repeat(152)}@mail.com`,
      message: "m".repeat(2001),
    });

    expect(result).toEqual({
      success: false,
      errors: {
        name: "El nombre es demasiado largo.",
        email: "El email es demasiado largo.",
        message: "El mensaje es demasiado largo.",
      },
    });
  });
});
