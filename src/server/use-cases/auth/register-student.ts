import { AuthTokenType } from "@prisma/client";
import { hashPassword } from "@/lib/auth/password";
import {
  buildEmailVerificationUrl,
  generatePlaintextToken,
  getEmailVerificationTokenExpiryDate,
  hashToken,
} from "@/lib/auth/tokens";
import { getTransactionalEmailSender } from "@/server/email/get-transactional-email-sender";
import { buildVerifyEmailMessage } from "@/server/email/messages/auth/build-verify-email-message";
import {
  validateRegisterInput,
} from "@/lib/validations/register";
import { prisma } from "@/lib/db/prisma";
import {
  createAuthToken,
  invalidateAuthTokensByUserIdAndType,
} from "@/server/repositories/auth-token-repository";
import {
  claimUserAccount,
  createStudentUser,
  findUserByEmailForRegistration,
} from "@/server/repositories/user-repository";
import type { UseCaseResult } from "@/server/use-cases/use-case-result";

type RegisterStudentData = {
  userId: string;
  email: string;
  name: string;
  claimedExistingUser: boolean;
  devPreviewVerificationUrl?: string;
};

function shouldFillName(existingName: string | null) {
  return !existingName || existingName.trim().length === 0;
}

export async function registerStudent(
  input: unknown,
): Promise<UseCaseResult<RegisterStudentData>> {
  const raw =
    typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};
  const origin = typeof raw.origin === "string" ? raw.origin.trim() : "";

  if (!origin) {
    return {
      success: false,
      status: 500,
      message: "No se pudo completar el registro.",
    };
  }

  const validationResult = validateRegisterInput(raw);

  if (!validationResult.success) {
    return {
      success: false,
      status: 400,
      message: "No se pudo completar el registro.",
      errors: validationResult.errors,
    };
  }

  const { name, email, password } = validationResult.data;
  const passwordHash = await hashPassword(password);
  const plaintextToken = generatePlaintextToken();
  const tokenHash = hashToken(plaintextToken);
  const expiresAt = getEmailVerificationTokenExpiryDate();
  const verificationUrl = buildEmailVerificationUrl(origin, plaintextToken);

  try {
    const result: UseCaseResult<RegisterStudentData> = await prisma.$transaction(
      async (tx): Promise<UseCaseResult<RegisterStudentData>> => {
      const existingUser = await findUserByEmailForRegistration(email, tx);

      if (existingUser && !existingUser.isActive) {
        return {
          success: false as const,
          status: 403,
          message: "Tu cuenta no esta habilitada. Contactanos para continuar.",
        };
      }

      if (existingUser?.passwordHash) {
        return {
          success: false as const,
          status: 409,
          message: "Ya existe una cuenta con ese email. Inicia sesion.",
        };
      }

      const user = existingUser
        ? await claimUserAccount(
            {
              id: existingUser.id,
              name: shouldFillName(existingUser.name) ? name : undefined,
              passwordHash,
            },
            tx,
          )
        : await createStudentUser(
            {
              name,
              email,
              passwordHash,
            },
            tx,
          );

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

      return {
        success: true as const,
        status: 201,
        message: existingUser
          ? "Tu cuenta fue activada correctamente. Ya puedes iniciar sesion."
          : "Tu cuenta fue creada correctamente. Ya puedes iniciar sesion.",
        data: {
          userId: user.id,
          email: user.email,
          name: user.name ?? name,
          claimedExistingUser: Boolean(existingUser),
        },
      };
      },
    );

    if (!result.success) {
      return result;
    }

    const sender = getTransactionalEmailSender();
    const message = await buildVerifyEmailMessage({
      to: result.data.email,
      name: result.data.name,
      verificationUrl,
    });
    const sendResult = await sender.send(message);

    if (!sendResult.ok) {
      console.warn("[auth] Verification email delivery failed after registration", {
        userId: result.data.userId,
        email: result.data.email,
        provider: sendResult.provider,
        code: sendResult.code,
        retryable: sendResult.retryable,
      });

      return {
        ...result,
        data: {
          ...result.data,
          devPreviewVerificationUrl: verificationUrl,
        },
        message:
          "Tu cuenta fue creada correctamente, pero no pudimos enviar el email de verificacion en este momento. Puedes solicitar un nuevo envio mas tarde.",
      };
    }

    console.info("[auth] Verification email delivered after registration", {
      userId: result.data.userId,
      email: result.data.email,
      provider: sendResult.provider,
      messageId: sendResult.messageId,
    });

    return {
      ...result,
      data: {
        ...result.data,
        devPreviewVerificationUrl: verificationUrl,
      },
    };
  } catch (error) {
    console.error("[auth] Register student failed", {
      email,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });

    return {
      success: false,
      status: 500,
      message: "No se pudo completar el registro.",
    };
  }
}
