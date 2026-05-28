import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ThreadAccent } from "@/components/ui/ThreadAccent";
import { footerContent } from "@/data/footer";
import { navigationItems, primaryNavigationCta } from "@/data/navigation";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Restablecer contraseña",
  description: "Define una nueva contraseña para recuperar el acceso a tu cuenta.",
  robots: {
    index: false,
    follow: false,
  },
};

type ResetPasswordPageProps = {
  searchParams?: Promise<{
    token?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = searchParams ? await searchParams : undefined;

  return (
    <>
      <SiteHeader items={navigationItems} cta={primaryNavigationCta} />

      <main className="pb-12 pt-8 sm:pb-16 sm:pt-10">
        <section className="py-16 sm:py-20" aria-labelledby="reset-password-page-heading">
          <Container>
            <div className="mx-auto max-w-2xl">
              <SectionHeading
                id="reset-password-page-heading"
                eyebrow="Nuevo acceso"
                title="Crea una nueva contraseña"
                description="Usa el enlace recibido para elegir una nueva contraseña y volver a ingresar."
              />
              <ThreadAccent className="mt-8 h-7 w-32" />

              <div className="mt-10">
                <ResetPasswordForm initialToken={params?.token} />
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter {...footerContent} />
    </>
  );
}
