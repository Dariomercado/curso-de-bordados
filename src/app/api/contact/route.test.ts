import { beforeEach, describe, expect, it, vi } from "vitest";

const { createContactLeadFromInputMock } = vi.hoisted(() => ({
  createContactLeadFromInputMock: vi.fn(),
}));

vi.mock("@/server/use-cases/create-contact-lead", () => ({
  createContactLeadFromInput: createContactLeadFromInputMock,
}));

import { POST } from "@/app/api/contact/route";

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 201 with the success message when the use case succeeds", async () => {
    createContactLeadFromInputMock.mockResolvedValue({
      success: true,
      status: 201,
      message: "Consulta enviada correctamente.",
    });

    const request = new Request("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "Susana" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);

    expect(createContactLeadFromInputMock).toHaveBeenCalledTimes(1);
    expect(createContactLeadFromInputMock).toHaveBeenCalledWith({ name: "Susana" });
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      message: "Consulta enviada correctamente.",
    });
  });

  it("returns 400 with message and field errors when the use case fails validation", async () => {
    createContactLeadFromInputMock.mockResolvedValue({
      success: false,
      status: 400,
      message: "Revisa los datos del formulario.",
      errors: {
        email: "Ingresa un email valido.",
      },
    });

    const request = new Request("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({ email: "invalido" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: "Revisa los datos del formulario.",
      errors: {
        email: "Ingresa un email valido.",
      },
    });
  });

  it("returns 500 when parsing or processing throws an unexpected error", async () => {
    const request = new Request("http://localhost:3000/api/contact", {
      method: "POST",
      body: "{",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);

    expect(createContactLeadFromInputMock).not.toHaveBeenCalled();
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      message: "No se pudo procesar la consulta. Intenta nuevamente.",
    });
  });
});
