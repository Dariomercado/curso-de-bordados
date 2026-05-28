import Link from "next/link";
import { UserRole } from "@prisma/client";
import type { NavigationItem } from "@/types/navigation";
import { SignOutButton } from "@/features/auth/components/SignOutButton";
import { getAuthSession } from "@/lib/auth/guards";
import { MobileNavMenu } from "./MobileNavMenu";
import { Container } from "./Container";
import { Button } from "../ui/Button";

type SiteHeaderProps = {
  items: NavigationItem[];
  cta?: NavigationItem;
};

export async function SiteHeader({ items, cta }: SiteHeaderProps) {
  const session = await getAuthSession();
  const isAuthenticated = Boolean(session?.user?.id);
  const accountHref =
    session?.user?.role === UserRole.ADMIN ? "/admin" : "/mi-cuenta";
  const accountLabel =
    session?.user?.role === UserRole.ADMIN ? "Admin" : "Mi cuenta";

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <Container className="relative flex min-h-20 items-center justify-between gap-6">
        <Link
          href="/"
          className="shrink-0 font-heading text-3xl font-semibold tracking-[0.02em] text-brand-strong"
        >
          Atelier de Bordado
        </Link>

        <div className="flex items-center gap-4">
          <MobileNavMenu
            items={items}
            isAuthenticated={isAuthenticated}
            accountHref={isAuthenticated ? accountHref : undefined}
            accountLabel={isAuthenticated ? accountLabel : undefined}
          />

          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded-full px-4 py-2 text-sm font-medium text-foreground-muted hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {isAuthenticated ? (
            <div className="hidden items-center gap-3 md:flex">
              <Button href={accountHref} size="sm">
                {accountLabel}
              </Button>
              <SignOutButton size="sm" className="px-5" />
            </div>
          ) : cta ? (
            <div className="hidden items-center gap-4 md:flex">
              <Link
                href="/registro"
                className="text-sm font-semibold text-brand hover:text-brand-strong"
              >
                Crear cuenta
              </Link>
              <Button href="/login" size="sm">
                Ingresar
              </Button>
            </div>
          ) : null}
        </div>
      </Container>
    </header>
  );
}
