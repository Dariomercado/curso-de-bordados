import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ThreadAccent } from "@/components/ui/ThreadAccent";
import { Button } from "@/components/ui/Button";
import { footerContent } from "@/data/footer";
import { navigationItems, primaryNavigationCta } from "@/data/navigation";
import { SignOutButton } from "@/features/auth/components/SignOutButton";
import { requireAuthSession } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "Mi cuenta",
  description: "Área privada de usuario de Atelier de Bordado.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AccountPage() {
  const session = await requireAuthSession();

  return (
    <>
      <SiteHeader items={navigationItems} cta={primaryNavigationCta} />

      <main className="pb-12 pt-8 sm:pb-16 sm:pt-10">
        <section className="py-16 sm:py-20" aria-labelledby="account-page-heading">
          <Container>
            <SectionHeading
              id="account-page-heading"
              eyebrow="Area privada"
              title="Mi cuenta"
              description="Resumen básico de tu acceso actual en la plataforma."
            />
            <ThreadAccent className="mt-8 h-7 w-32" />

            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <article className="rounded-[2rem] border border-border/70 bg-surface-strong p-6 shadow-soft sm:p-8">
                <dl className="grid gap-6">
                  <div>
                    <dt className="text-sm uppercase tracking-[0.18em] text-foreground-muted">
                      Nombre
                    </dt>
                    <dd className="mt-2 text-lg text-foreground">
                      {session.user.name ?? "Sin nombre cargado"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm uppercase tracking-[0.18em] text-foreground-muted">
                      Email
                    </dt>
                    <dd className="mt-2 text-lg text-foreground">{session.user.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm uppercase tracking-[0.18em] text-foreground-muted">
                      Rol
                    </dt>
                    <dd className="mt-2 text-lg text-foreground">{session.user.role}</dd>
                  </div>
                </dl>
              </article>

              <aside className="rounded-[2rem] border border-border/70 bg-surface px-6 py-8 shadow-soft sm:px-8">
                <h2 className="font-heading text-3xl leading-tight text-foreground">
                  Accesos
                </h2>
                <div className="mt-6 grid gap-4">
                  <Button href="/mis-cursos" variant="secondary" className="w-full">
                    Ver mis cursos
                  </Button>
                  {session.user.role === "ADMIN" ? (
                    <Button href="/admin" className="w-full">
                      Ir al admin
                    </Button>
                  ) : null}
                  <SignOutButton />
                </div>
              </aside>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter {...footerContent} />
    </>
  );
}
