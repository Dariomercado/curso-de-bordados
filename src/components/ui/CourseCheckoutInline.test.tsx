import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CourseCheckoutInline } from "@/components/ui/CourseCheckoutInline";

describe("CourseCheckoutInline", () => {
  const originalFetch = global.fetch;
  const assignMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        ...window.location,
        assign: assignMock,
      },
    });
  });

  it("posts the checkout request and redirects to initPoint", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: "Checkout iniciado correctamente.",
        data: {
          initPoint: "https://www.mercadopago.com/init",
          sandboxInitPoint: null,
        },
      }),
    } as Response);

    render(
      <CourseCheckoutInline
        courseSlug="bordado-para-principiantes"
        courseTitle="Bordado para principiantes"
        initialEmail="susana@email.com"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Continuar al pago" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/payments/mercadopago/checkout",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseSlug: "bordado-para-principiantes",
            buyerEmail: "susana@email.com",
          }),
        }),
      );
    });

    await waitFor(() => {
      expect(assignMock).toHaveBeenCalledWith("https://www.mercadopago.com/init");
    });
  });

  it("shows a visible error when the checkout request fails", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        message: "No se pudo iniciar la compra.",
        errors: {
          buyerEmail: "Ingresa un email valido.",
        },
      }),
    } as Response);

    render(
      <CourseCheckoutInline
        courseSlug="bordado-para-principiantes"
        courseTitle="Bordado para principiantes"
      />,
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "susana@email.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Continuar al pago" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Ingresa un email valido.",
    );
    expect(assignMock).not.toHaveBeenCalled();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });
});
