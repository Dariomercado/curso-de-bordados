import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

function getDb(db?: Prisma.TransactionClient) {
  return db ?? prisma;
}

export async function findUserByEmail(email: string, db?: Prisma.TransactionClient) {
  return getDb(db).user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
    },
  });
}

export async function findUserByEmailForPasswordReset(
  email: string,
  db?: Prisma.TransactionClient,
) {
  return getDb(db).user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
      emailVerifiedAt: true,
    },
  });
}

export async function findUserByEmailForEmailVerification(
  email: string,
  db?: Prisma.TransactionClient,
) {
  return getDb(db).user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
      emailVerifiedAt: true,
    },
  });
}

export async function findUserByEmailForRegistration(
  email: string,
  db?: Prisma.TransactionClient,
) {
  return getDb(db).user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      passwordHash: true,
      role: true,
      isActive: true,
      emailVerifiedAt: true,
    },
  });
}

export async function createStudentUser(
  input: {
    name: string;
    email: string;
    passwordHash: string;
  },
  db?: Prisma.TransactionClient,
) {
  return getDb(db).user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash: input.passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      emailVerifiedAt: true,
    },
  });
}

export async function claimUserAccount(
  input: {
    id: string;
    name?: string;
    passwordHash: string;
  },
  db?: Prisma.TransactionClient,
) {
  return getDb(db).user.update({
    where: {
      id: input.id,
    },
    data: {
      ...(input.name ? { name: input.name } : {}),
      passwordHash: input.passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      emailVerifiedAt: true,
    },
  });
}

export async function upsertUserByEmail(email: string, db?: Prisma.TransactionClient) {
  return getDb(db).user.upsert({
    where: {
      email,
    },
    update: {},
    create: {
      email,
    },
    select: {
      id: true,
      email: true,
    },
  });
}

export async function updateUserPassword(
  input: {
    id: string;
    passwordHash: string;
    verifyEmail?: boolean;
  },
  db?: Prisma.TransactionClient,
) {
  return getDb(db).user.update({
    where: {
      id: input.id,
    },
    data: {
      passwordHash: input.passwordHash,
      ...(input.verifyEmail ? { emailVerifiedAt: new Date() } : {}),
    },
    select: {
      id: true,
      email: true,
      emailVerifiedAt: true,
    },
  });
}

export async function markUserEmailVerifiedById(
  id: string,
  db?: Prisma.TransactionClient,
) {
  return getDb(db).user.update({
    where: {
      id,
    },
    data: {
      emailVerifiedAt: new Date(),
    },
    select: {
      id: true,
      email: true,
      emailVerifiedAt: true,
    },
  });
}
