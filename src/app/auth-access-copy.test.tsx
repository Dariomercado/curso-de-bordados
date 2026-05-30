import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const {
  getAuthSessionMock,
  requireAuthSessionMock,
  redirectMock,
  enrollmentFindManyMock,
} = vi.hoisted(() => ({
  getAuthSessionMock: vi.fn(),
  requireAuthSessionMock: vi.fn(),
  redirectMock: vi.fn(),
  enrollmentFindManyMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
  useRouter: () => ({
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

vi.mock("@/components/layout/SiteHeader", () => ({
  SiteHeader: () => <header>Header</header>,
}));

vi.mock("@/components/layout/SiteFooter", () => ({
  SiteFooter: () => <footer>Footer</footer>,
}));

vi.mock("@/components/ui/ThreadAccent", () => ({
  ThreadAccent: () => <div data-testid="thread-accent" />,
}));

vi.mock("@/lib/auth/guards", () => ({
  getAuthSession: getAuthSessionMock,
  requireAuthSession: requireAuthSessionMock,
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    enrollment: {
      findMany: enrollmentFindManyMock,
    },
  },
}));

import LoginPage from "@/app/login/page";
import MyCoursesPage from "@/app/mis-cursos/page";
import ForgotPasswordPage from "@/app/recuperar-contrasena/page";

describe("buyer access copy", () => {
  it("login explains how guest buyers activate access", async () => {
    getAuthSessionMock.mockResolvedValue(null);

    render(await LoginPage());

    expect(
      screen.getByText(/si todavia no tenes contrasena o compraste como invitada/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /olvide mi contrasena \/ activar acceso/i }),
    ).toHaveAttribute("href", "/recuperar-contrasena");
  });

  it("recover password page frames reset as access activation", () => {
    render(<ForgotPasswordPage />);

    expect(
      screen.getByRole("heading", {
        name: /activa tu acceso o restablece tu contrasena/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/si tu pago ya fue confirmado/i),
    ).toBeInTheDocument();
  });

  it("mis cursos empty state guides recent buyers to wait or activate access", async () => {
    requireAuthSessionMock.mockResolvedValue({
      user: {
        id: "user-1",
        role: "STUDENT",
      },
    });
    enrollmentFindManyMock.mockResolvedValue([]);

    render(await MyCoursesPage());

    expect(
      screen.getByText(/todavia no vemos cursos habilitados/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/la confirmacion de Mercado Pago puede tardar unos minutos/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /activar acceso \/ restablecer contrasena/i,
      }),
    ).toHaveAttribute("href", "/recuperar-contrasena");
  });
});
