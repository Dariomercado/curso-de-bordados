import { renderEmailTemplate } from "@/server/email/render/render-email-template";
import { VerifyEmailTemplate } from "@/server/email/templates/auth/verify-email-template";
import type { TransactionalEmailMessage } from "@/server/email/types";

type BuildVerifyEmailMessageInput = {
  to: string;
  name?: string | null;
  verificationUrl: string;
};

const SUBJECT = "Verifica tu email en Atelier de Bordado";
const PREVIEW_TEXT = "Confirma tu email para completar la configuracion de tu cuenta.";
const EXPIRES_IN_TEXT = "48 horas";

export async function buildVerifyEmailMessage({
  to,
  name,
  verificationUrl,
}: BuildVerifyEmailMessageInput): Promise<TransactionalEmailMessage> {
  const text = [
    name ? `Hola ${name},` : "Hola,",
    "",
    "Confirma tu email para terminar de configurar tu cuenta en Atelier de Bordado.",
    `Este enlace estara disponible durante ${EXPIRES_IN_TEXT}.`,
    "",
    verificationUrl,
    "",
    "Si no solicitaste este mensaje, puedes ignorarlo con tranquilidad.",
  ].join("\n");

  const { html } = await renderEmailTemplate({
    template: (
      <VerifyEmailTemplate
        name={name}
        verificationUrl={verificationUrl}
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
        value: "auth_verify_email",
      },
    ],
  };
}
