import { Text } from "@react-email/components";
import { AuthEmailLayout } from "@/server/email/templates/auth/auth-email-layout";

type VerifyEmailTemplateProps = {
  name?: string | null;
  verificationUrl: string;
  expiresInText: string;
  previewText: string;
};

export function VerifyEmailTemplate({
  name,
  verificationUrl,
  expiresInText,
  previewText,
}: VerifyEmailTemplateProps) {
  return (
    <AuthEmailLayout
      previewText={previewText}
      title="Verifica tu email"
      intro={
        name
          ? `Hola ${name}, confirma tu email para terminar de configurar tu cuenta y mantener tu acceso disponible.`
          : "Confirma tu email para terminar de configurar tu cuenta y mantener tu acceso disponible."
      }
      ctaLabel="Verificar email"
      ctaUrl={verificationUrl}
      footerNote="Por seguridad, este enlace tiene una validez limitada y puede quedar reemplazado si solicitas uno nuevo."
    >
      <Text style={paragraph}>
        Este enlace estara disponible durante {expiresInText}. Si necesitas un nuevo acceso,
        puedes solicitar otra verificacion desde la plataforma.
      </Text>
    </AuthEmailLayout>
  );
}

const paragraph = {
  color: "#6f6258",
  fontSize: "16px",
  lineHeight: "1.8",
  margin: 0,
};
