import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ThreadAccent } from "@/components/ui/ThreadAccent";
import {
  parseEmailVerificationResultCode,
  type EmailVerificationResultCode,
} from "@/lib/auth/email-verification";
import { footerContent } from "@/data/footer";
import { navigationItems, primaryNavigationCta } from "@/data/navigation";

export const metadata: Metadata = {
  title: "Verificar email",
  description: "Consulta el estado de verificación de tu email.",
  robots: {
    index: false,
    follow: false,
  },
};

type VerifyEmailPageProps = {
  searchParams?: Promise<{
    code?: string;
  }>;
};

const contentByCode: Record<
  EmailVerificationResultCode,
  {
    eyebrow: string;
    title: string;
    description: string;
  }
> = {
  success: {
    eyebrow: "Email verificado",
    title: "Tu email ya quedó verificado",
    description:
      "La verificación se completó correctamente. Ya puedes continuar usando tu cuenta con normalidad.",
  },
  invalid: {
    eyebrow: "Enlace inválido",
    title: "No pudimos verificar tu email",
    description:
      "El enlace no es válido o no corresponde a una verificación activa. Solicita uno nuevo si lo necesitas.",
  },
  expired: {
    eyebrow: "Enlace expirado",
    title: "Tu enlace de verificación venció",
    description:
      "Por seguridad, este enlace ya no está disponible. Solicita una nueva verificación para continuar.",
  },
  used: {
    eyebrow: "Enlace no disponible",
    title: "Este enlace ya fue utilizado",
    description:
      "El enlace ya se usó antes o fue reemplazado por uno más reciente. Si hace falta, solicita una nueva verificación.",
  },
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const code = parseEmailVerificationResultCode(params?.code) ?? "invalid";
  const content = contentByCode[code];

  return (
    <>
      <SiteHeader items={navigationItems} cta={primaryNavigationCta} />

      <main className="pb-12 pt-8 sm:pb-16 sm:pt-10">
        <section className="py-16 sm:py-20" aria-labelledby="verify-email-page-heading">
          <Container>
            <div className="mx-auto max-w-2xl">
              <SectionHeading
                id="verify-email-page-heading"
                eyebrow={content.eyebrow}
                title={content.title}
                description={content.description}
              />
              <ThreadAccent className="mt-8 h-7 w-32" />

              <div className="mt-10 rounded-[2rem] border border-border/70 bg-surface-strong p-6 shadow-soft sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                  <Button href="/login">Ir a iniciar sesión</Button>
                  <Button href="/registro" variant="secondary">
                    Volver al registro
                  </Button>
                  <Link
                    href="/recuperar-contrasena"
                    className="inline-flex items-center text-sm font-semibold text-brand hover:text-brand-strong"
                  >
                    Necesito ayuda con mi acceso
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter {...footerContent} />
    </>
  );
}
