import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ThreadAccent } from "@/components/ui/ThreadAccent";
import { footerContent } from "@/data/footer";
import { navigationItems, primaryNavigationCta } from "@/data/navigation";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { getAuthSession } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "Ingresar",
  description: "Acceso privado para administracion y alumnas de Atelier de Bordado.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const session = await getAuthSession();

  if (session?.user?.id) {
    redirect(session.user.role === "ADMIN" ? "/admin" : "/mi-cuenta");
  }

  return (
    <>
      <SiteHeader items={navigationItems} cta={primaryNavigationCta} />

      <main className="pb-12 pt-8 sm:pb-16 sm:pt-10">
        <section className="py-16 sm:py-20" aria-labelledby="login-page-heading">
          <Container>
            <div className="mx-auto max-w-2xl">
              <SectionHeading
                id="login-page-heading"
                eyebrow="Acceso privado"
                title="Inicia sesion"
                description="Ingresa con el email que usaste para comprar. Si todavia no tenes contrasena o compraste como invitada, podes activar tu acceso en un paso."
              />
              <ThreadAccent className="mt-8 h-7 w-32" />

              <div className="mt-10">
                <LoginForm />
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter {...footerContent} />
    </>
  );
}
