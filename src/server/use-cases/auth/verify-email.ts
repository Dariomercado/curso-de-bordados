import { AuthTokenType } from "@prisma/client";
import { hashToken } from "@/lib/auth/tokens";
import { prisma } from "@/lib/db/prisma";
import { validateVerifyEmailInput } from "@/lib/validations/verify-email";
import {
  consumeAuthTokenById,
  findAuthTokenByHashAndType,
  invalidateAuthTokensByUserIdAndType,
} from "@/server/repositories/auth-token-repository";
import { markUserEmailVerifiedById } from "@/server/repositories/user-repository";

export type VerifyEmailResult =
  | {
      outcome: "success";
      alreadyVerified: boolean;
    }
  | {
      outcome: "invalid" | "expired" | "already_used";
    };

export async function verifyEmail(input: unknown): Promise<VerifyEmailResult> {
  const validationResult = validateVerifyEmailInput(input);

  if (!validationResult.success) {
    return {
      outcome: "invalid",
    };
  }

  const { token } = validationResult.data;
  const tokenHash = hashToken(token);

  try {
    const authToken = await findAuthTokenByHashAndType(
      tokenHash,
      AuthTokenType.EMAIL_VERIFICATION,
    );

    if (!authToken || !authToken.user.isActive) {
      return {
        outcome: "invalid",
      };
    }

    if (authToken.consumedAt) {
      return {
        outcome: "already_used",
      };
    }

    if (authToken.expiresAt.getTime() <= Date.now()) {
      return {
        outcome: "expired",
      };
    }

    const alreadyVerified = authToken.user.emailVerifiedAt !== null;

    const result = await prisma.$transaction(async (tx) => {
      const consumeResult = await consumeAuthTokenById(authToken.id, tx);

      if (consumeResult.count === 0) {
        return {
          outcome: "already_used" as const,
        };
      }

      if (!alreadyVerified) {
        await markUserEmailVerifiedById(authToken.userId, tx);
      }

      await invalidateAuthTokensByUserIdAndType(
        authToken.userId,
        AuthTokenType.EMAIL_VERIFICATION,
        tx,
      );

      return {
        outcome: "success" as const,
        alreadyVerified,
      };
    });

    return result;
  } catch (error) {
    console.error("[auth] Verify email failed", {
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });

    return {
      outcome: "invalid",
    };
  }
}
