import { AuthTokenType } from "@prisma/client";
import {
  buildPasswordResetUrl,
  generatePlaintextToken,
  getPasswordResetTokenExpiryDate,
  hashToken,
} from "@/lib/auth/tokens";
import { prisma } from "@/lib/db/prisma";
import { validateForgotPasswordInput } from "@/lib/validations/forgot-password";
import { getTransactionalEmailSender } from "@/server/email/get-transactional-email-sender";
import { buildPasswordResetMessage } from "@/server/email/messages/auth/build-password-reset-message";
import {
  createAuthToken,
  invalidateAuthTokensByUserIdAndType,
} from "@/server/repositories/auth-token-repository";
import { findUserByEmailForPasswordReset } from "@/server/repositories/user-repository";
import type { UseCaseResult } from "@/server/use-cases/use-case-result";

const SUCCESS_MESSAGE =
  "Si el email existe, te enviamos instrucciones para restablecer tu contrasena.";

type SendPasswordResetData = {
  devPreviewResetUrl?: string;
} | null;

export async function sendPasswordReset(
  input: unknown,
): Promise<UseCaseResult<SendPasswordResetData>> {
  const raw =
    typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};
  const origin = typeof raw.origin === "string" ? raw.origin.trim() : "";

  if (!origin) {
    return {
      success: false,
      status: 500,
      message: "No se pudo procesar la solicitud.",
    };
  }

  const validationResult = validateForgotPasswordInput(raw);

  if (!validationResult.success) {
    return {
      success: false,
      status: 400,
      message: "No se pudo procesar la solicitud.",
      errors: validationResult.errors,
    };
  }

  const { email } = validationResult.data;

  try {
    const user = await findUserByEmailForPasswordReset(email);

    if (!user || !user.isActive) {
      return {
        success: true,
        status: 200,
        message: SUCCESS_MESSAGE,
        data: null,
      };
    }

    const plaintextToken = generatePlaintextToken();
    const tokenHash = hashToken(plaintextToken);
    const expiresAt = getPasswordResetTokenExpiryDate();
    const resetUrl = buildPasswordResetUrl(origin, plaintextToken);

    await prisma.$transaction(async (tx) => {
      await invalidateAuthTokensByUserIdAndType(
        user.id,
        AuthTokenType.PASSWORD_RESET,
        tx,
      );

      await createAuthToken(
        {
          userId: user.id,
          type: AuthTokenType.PASSWORD_RESET,
          tokenHash,
          expiresAt,
        },
        tx,
      );
    });

    const sender = getTransactionalEmailSender();
    const message = await buildPasswordResetMessage({
      to: user.email,
      name: user.name,
      resetUrl,
    });
    const sendResult = await sender.send(message);

    if (!sendResult.ok) {
      console.warn("[auth] Password reset delivery failed", {
        email,
        provider: sendResult.provider,
        code: sendResult.code,
        retryable: sendResult.retryable,
      });
    } else {
      console.info("[auth] Password reset delivered", {
        email,
        provider: sendResult.provider,
        messageId: sendResult.messageId,
      });
    }

    return {
      success: true,
      status: 200,
      message: SUCCESS_MESSAGE,
      data: {
        devPreviewResetUrl: resetUrl,
      },
    };
  } catch (error) {
    console.error("[auth] Send password reset failed", {
      email,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });

    return {
      success: false,
      status: 500,
      message: "No se pudo procesar la solicitud.",
    };
  }
}
