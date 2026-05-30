import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ThreadAccent } from "@/components/ui/ThreadAccent";
import { footerContent } from "@/data/footer";
import { navigationItems, primaryNavigationCta } from "@/data/navigation";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Activar acceso o recuperar contrasena",
  description: "Solicita un enlace para crear o restablecer tu contrasena de acceso.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return (
    <>
      <SiteHeader items={navigationItems} cta={primaryNavigationCta} />

      <main className="pb-12 pt-8 sm:pb-16 sm:pt-10">
        <section className="py-16 sm:py-20" aria-labelledby="forgot-password-page-heading">
          <Container>
            <div className="mx-auto max-w-2xl">
              <SectionHeading
                id="forgot-password-page-heading"
                eyebrow="Activar acceso"
                title="Activa tu acceso o restablece tu contrasena"
                description="Ingresa el email que usaste para comprar. Si tu pago ya fue confirmado, te enviaremos un enlace para crear una contrasena y entrar a tus cursos."
              />
              <ThreadAccent className="mt-8 h-7 w-32" />

              <div className="mt-10">
                <ForgotPasswordForm />
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter {...footerContent} />
    </>
  );
}
