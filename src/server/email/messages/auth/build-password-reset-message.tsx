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

export async function buildAccessActivationMessage({
  to,
  name,
  resetUrl,
}: BuildPasswordResetMessageInput): Promise<TransactionalEmailMessage> {
  const subject = "Activa tu acceso en Atelier de Bordado";
  const previewText = "Define tu contrasena para entrar a tu curso.";
  const intro = name
    ? `Hola ${name}, tu compra fue confirmada y ya tienes acceso a tu curso.`
    : "Tu compra fue confirmada y ya tienes acceso a tu curso.";
  const body = `Usa este enlace para definir tu contrasena y entrar a tu cuenta. Por seguridad, estara disponible durante ${EXPIRES_IN_TEXT}. Si ya activaste tu acceso, puedes ignorar este mensaje.`;
  const text = [
    name ? `Hola ${name},` : "Hola,",
    "",
    "Tu compra fue confirmada y ya tienes acceso a tu curso en Atelier de Bordado.",
    "Usa este enlace para definir tu contrasena y entrar a tu cuenta.",
    `Este enlace estara disponible durante ${EXPIRES_IN_TEXT}.`,
    "",
    resetUrl,
    "",
    "Si ya activaste tu acceso, puedes ignorar este mensaje.",
  ].join("\n");

  const { html } = await renderEmailTemplate({
    template: (
      <PasswordResetTemplate
        name={name}
        resetUrl={resetUrl}
        expiresInText={EXPIRES_IN_TEXT}
        previewText={previewText}
        title="Activa tu acceso"
        intro={intro}
        ctaLabel="Activar acceso"
        body={body}
      />
    ),
    text,
  });

  return {
    to,
    subject,
    html,
    text,
    tags: [
      {
        name: "category",
        value: "auth_access_activation",
      },
    ],
  };
}
