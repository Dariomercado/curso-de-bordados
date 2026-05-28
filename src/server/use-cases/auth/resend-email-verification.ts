import { AuthTokenType } from "@prisma/client";
import {
  buildEmailVerificationUrl,
  generatePlaintextToken,
  getEmailVerificationTokenExpiryDate,
  hashToken,
} from "@/lib/auth/tokens";
import { prisma } from "@/lib/db/prisma";
import { validateResendEmailVerificationInput } from "@/lib/validations/resend-email-verification";
import { getTransactionalEmailSender } from "@/server/email/get-transactional-email-sender";
import { buildVerifyEmailMessage } from "@/server/email/messages/auth/build-verify-email-message";
import {
  createAuthToken,
  invalidateAuthTokensByUserIdAndType,
} from "@/server/repositories/auth-token-repository";
import { findUserByEmailForEmailVerification } from "@/server/repositories/user-repository";
import type { UseCaseResult } from "@/server/use-cases/use-case-result";

const SUCCESS_MESSAGE =
  "Si el email corresponde a una cuenta pendiente de verificacion, te enviamos un nuevo enlace.";

export async function resendEmailVerification(
  input: unknown,
): Promise<UseCaseResult<null>> {
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

  const validationResult = validateResendEmailVerificationInput(raw);

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
    const user = await findUserByEmailForEmailVerification(email);

    if (!user || !user.isActive || user.emailVerifiedAt) {
      return {
        success: true,
        status: 200,
        message: SUCCESS_MESSAGE,
        data: null,
      };
    }

    const plaintextToken = generatePlaintextToken();
    const tokenHash = hashToken(plaintextToken);
    const expiresAt = getEmailVerificationTokenExpiryDate();
    const verificationUrl = buildEmailVerificationUrl(origin, plaintextToken);

    await prisma.$transaction(async (tx) => {
      await invalidateAuthTokensByUserIdAndType(
        user.id,
        AuthTokenType.EMAIL_VERIFICATION,
        tx,
      );

      await createAuthToken(
        {
          userId: user.id,
          type: AuthTokenType.EMAIL_VERIFICATION,
          tokenHash,
          expiresAt,
        },
        tx,
      );
    });

    const sender = getTransactionalEmailSender();
    const message = await buildVerifyEmailMessage({
      to: user.email,
      name: user.name,
      verificationUrl,
    });
    const sendResult = await sender.send(message);

    if (!sendResult.ok) {
      console.warn("[auth] Verification resend delivery failed", {
        email,
        provider: sendResult.provider,
        code: sendResult.code,
        retryable: sendResult.retryable,
      });
    } else {
      console.info("[auth] Verification resend delivered", {
        email,
        provider: sendResult.provider,
        messageId: sendResult.messageId,
      });
    }

    return {
      success: true,
      status: 200,
      message: SUCCESS_MESSAGE,
      data: null,
    };
  } catch (error) {
    console.error("[auth] Resend email verification failed", {
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
