import { renderEmailTemplate } from "@/server/email/render/render-email-template";
import { PasswordResetTemplate } from "@/server/email/templates/auth/password-reset-template";
import type { TransactionalEmailMessage } from "@/server/email/types";

type BuildPasswordResetMessageInput = {
  to: string;
  name?: string | null;
  resetUrl: string;
};

const SUBJECT = "Restablece tu contrasena en Atelier de Bordado";
const PREVIEW_TEXT = "Usa este enlace para definir una nueva contrasena.";
const EXPIRES_IN_TEXT = "2 horas";

export async function buildPasswordResetMessage({
  to,
  name,
  resetUrl,
}: BuildPasswordResetMessageInput): Promise<TransactionalEmailMessage> {
  const text = [
    name ? `Hola ${name},` : "Hola,",
    "",
    "Recibimos una solicitud para cambiar la contrasena de tu cuenta en Atelier de Bordado.",
    `Este enlace estara disponible durante ${EXPIRES_IN_TEXT}.`,
    "",
    resetUrl,
    "",
    "Si no solicitaste este cambio, puedes ignorar este mensaje.",
  ].join("\n");

  const { html } = await renderEmailTemplate({
    template: (
      <PasswordResetTemplate
        name={name}
        resetUrl={resetUrl}
        expiresInText={EXPIRES_IN_TEXT}
        previewText={PREVIEW_TEXT}
      />
    ),
    text,
  });

  return {
    to,
    subject: SUBJECT,
    html,
    text,
    tags: [
      {
        name: "category",
        value: "auth_password_reset",
      },
    ],
  };
}
