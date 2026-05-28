import { AuthTokenType } from "@prisma/client";
import { hashPassword } from "@/lib/auth/password";
import { hashToken } from "@/lib/auth/tokens";
import { prisma } from "@/lib/db/prisma";
import { validateResetPasswordInput } from "@/lib/validations/reset-password";
import {
  consumeAuthTokenById,
  findAuthTokenByHashAndType,
  invalidateAuthTokensByUserIdAndType,
} from "@/server/repositories/auth-token-repository";
import { updateUserPassword } from "@/server/repositories/user-repository";
import type { UseCaseResult } from "@/server/use-cases/use-case-result";

const INVALID_TOKEN_MESSAGE = "El enlace no es valido o expiro.";

export async function resetPassword(
  input: unknown,
): Promise<UseCaseResult<null>> {
  const validationResult = validateResetPasswordInput(input);

  if (!validationResult.success) {
    const tokenError = validationResult.errors.token;

    if (tokenError) {
      return {
        success: false,
        status: 410,
        message: INVALID_TOKEN_MESSAGE,
      };
    }

    return {
      success: false,
      status: 400,
      message: "No se pudo restablecer la contrasena.",
      errors: validationResult.errors,
    };
  }

  const { token, password } = validationResult.data;
  const tokenHash = hashToken(token);

  try {
    const authToken = await findAuthTokenByHashAndType(
      tokenHash,
      AuthTokenType.PASSWORD_RESET,
    );

    if (
      !authToken ||
      authToken.consumedAt ||
      authToken.expiresAt.getTime() <= Date.now() ||
      !authToken.user.isActive
    ) {
      return {
        success: false,
        status: 410,
        message: INVALID_TOKEN_MESSAGE,
      };
    }

    const passwordHash = await hashPassword(password);

    const result = await prisma.$transaction(async (tx) => {
      const consumeResult = await consumeAuthTokenById(authToken.id, tx);

      if (consumeResult.count === 0) {
        return {
          success: false as const,
          status: 410,
          message: INVALID_TOKEN_MESSAGE,
        };
      }

      await updateUserPassword(
        {
          id: authToken.userId,
          passwordHash,
          verifyEmail: authToken.user.emailVerifiedAt === null,
        },
        tx,
      );

      await invalidateAuthTokensByUserIdAndType(
        authToken.userId,
        AuthTokenType.PASSWORD_RESET,
        tx,
      );

      return {
        success: true as const,
        status: 200,
        message: "Tu contrasena fue actualizada correctamente. Ya puedes iniciar sesion.",
        data: null,
      };
    });

    return result;
  } catch (error) {
    console.error("[auth] Reset password failed", {
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });

    return {
      success: false,
      status: 500,
      message: "No se pudo restablecer la contrasena.",
    };
  }
}
