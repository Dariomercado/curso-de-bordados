import { AuthTokenType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

function getDb(db?: Prisma.TransactionClient) {
  return db ?? prisma;
}

export async function invalidateAuthTokensByUserIdAndType(
  userId: string,
  type: AuthTokenType,
  db?: Prisma.TransactionClient,
) {
  return getDb(db).authToken.updateMany({
    where: {
      userId,
      type,
      consumedAt: null,
    },
    data: {
      consumedAt: new Date(),
    },
  });
}

export async function createAuthToken(
  input: {
    userId: string;
    type: AuthTokenType;
    tokenHash: string;
    expiresAt: Date;
  },
  db?: Prisma.TransactionClient,
) {
  return getDb(db).authToken.create({
    data: {
      userId: input.userId,
      type: input.type,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
    },
    select: {
      id: true,
      userId: true,
      type: true,
      expiresAt: true,
      consumedAt: true,
      createdAt: true,
    },
  });
}

export async function findAuthTokenByHashAndType(
  tokenHash: string,
  type: AuthTokenType,
  db?: Prisma.TransactionClient,
) {
  return getDb(db).authToken.findFirst({
    where: {
      tokenHash,
      type,
    },
    select: {
      id: true,
      userId: true,
      type: true,
      expiresAt: true,
      consumedAt: true,
      user: {
        select: {
          id: true,
          isActive: true,
          emailVerifiedAt: true,
        },
      },
    },
  });
}

export async function consumeAuthTokenById(
  id: string,
  db?: Prisma.TransactionClient,
) {
  return getDb(db).authToken.updateMany({
    where: {
      id,
      consumedAt: null,
    },
    data: {
      consumedAt: new Date(),
    },
  });
}
