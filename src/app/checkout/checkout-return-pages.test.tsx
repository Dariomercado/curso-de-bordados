import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CheckoutFailurePage from "@/app/checkout/failure/page";
import CheckoutPendingPage from "@/app/checkout/pending/page";
import CheckoutSuccessPage from "@/app/checkout/success/page";

vi.mock("@/components/layout/SiteHeader", () => ({
  SiteHeader: () => <header>Header</header>,
}));

vi.mock("@/components/layout/SiteFooter", () => ({
  SiteFooter: () => <footer>Footer</footer>,
}));

describe("checkout return pages", () => {
  it("guides successful guest buyers to activate access before viewing courses", () => {
    render(<CheckoutSuccessPage />);

    expect(
      screen.getByRole("heading", {
        name: "Pago recibido. Estamos habilitando tu acceso.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Activar acceso / crear contrasena" }),
    ).toHaveAttribute("href", "/recuperar-contrasena");
    expect(
      screen.getByRole("link", { name: "Ya tengo cuenta: ir a mis cursos" }),
    ).toHaveAttribute("href", "/mis-cursos");
  });

  it("explains pending payments and keeps activation available", () => {
    render(<CheckoutPendingPage />);

    expect(
      screen.getByText(/No hace falta volver a comprar/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Activar acceso" })).toHaveAttribute(
      "href",
      "/recuperar-contrasena",
    );
    expect(screen.getByRole("link", { name: "Ver mis cursos" })).toHaveAttribute(
      "href",
      "/mis-cursos",
    );
  });

  it("clarifies failed payments and points to contact", () => {
    render(<CheckoutFailurePage />);

    expect(
      screen.getByRole("heading", { name: "El pago no se completo." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Necesito ayuda" })).toHaveAttribute(
      "href",
      "/contacto",
    );
  });
});
