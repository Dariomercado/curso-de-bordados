import { Text } from "@react-email/components";
import { AuthEmailLayout } from "@/server/email/templates/auth/auth-email-layout";

type PasswordResetTemplateProps = {
  name?: string | null;
  resetUrl: string;
  expiresInText: string;
  previewText: string;
};

export function PasswordResetTemplate({
  name,
  resetUrl,
  expiresInText,
  previewText,
}: PasswordResetTemplateProps) {
  return (
    <AuthEmailLayout
      previewText={previewText}
      title="Restablece tu contrasena"
      intro={
        name
          ? `Hola ${name}, recibimos una solicitud para cambiar la contrasena de tu cuenta.`
          : "Recibimos una solicitud para cambiar la contrasena de tu cuenta."
      }
      ctaLabel="Restablecer contrasena"
      ctaUrl={resetUrl}
    >
      <Text style={paragraph}>
        Usa este enlace para definir una nueva contrasena. Por seguridad, estara
        disponible durante {expiresInText}. Si no solicitaste este cambio, puedes ignorar
        este mensaje.
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
