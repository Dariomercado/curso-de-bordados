import { AuthTokenType, UserRole } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  transactionMock,
  userFindUniqueMock,
  findUserByEmailForPasswordResetMock,
  invalidateAuthTokensByUserIdAndTypeMock,
  createAuthTokenMock,
  findAuthTokenByHashAndTypeMock,
  consumeAuthTokenByIdMock,
  updateUserPasswordMock,
  generatePlaintextTokenMock,
  hashTokenMock,
  getPasswordResetTokenExpiryDateMock,
  hashPasswordMock,
  verifyPasswordMock,
  sendEmailMock,
} = vi.hoisted(() => ({
  transactionMock: vi.fn(),
  userFindUniqueMock: vi.fn(),
  findUserByEmailForPasswordResetMock: vi.fn(),
  invalidateAuthTokensByUserIdAndTypeMock: vi.fn(),
  createAuthTokenMock: vi.fn(),
  findAuthTokenByHashAndTypeMock: vi.fn(),
  consumeAuthTokenByIdMock: vi.fn(),
  updateUserPasswordMock: vi.fn(),
  generatePlaintextTokenMock: vi.fn(),
  hashTokenMock: vi.fn(),
  getPasswordResetTokenExpiryDateMock: vi.fn(),
  hashPasswordMock: vi.fn(),
  verifyPasswordMock: vi.fn(),
  sendEmailMock: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    $transaction: transactionMock,
    user: {
      findUnique: userFindUniqueMock,
    },
  },
}));

vi.mock("@/server/repositories/user-repository", () => ({
  findUserByEmailForPasswordReset: findUserByEmailForPasswordResetMock,
  updateUserPassword: updateUserPasswordMock,
}));

vi.mock("@/server/repositories/auth-token-repository", () => ({
  invalidateAuthTokensByUserIdAndType: invalidateAuthTokensByUserIdAndTypeMock,
  createAuthToken: createAuthTokenMock,
  findAuthTokenByHashAndType: findAuthTokenByHashAndTypeMock,
  consumeAuthTokenById: consumeAuthTokenByIdMock,
}));

vi.mock("@/lib/auth/tokens", () => ({
  buildPasswordResetUrl: (origin: string, token: string) =>
    `${origin}/restablecer-contrasena?token=${token}`,
  generatePlaintextToken: generatePlaintextTokenMock,
  getPasswordResetTokenExpiryDate: getPasswordResetTokenExpiryDateMock,
  hashToken: hashTokenMock,
}));

vi.mock("@/lib/auth/password", () => ({
  hashPassword: hashPasswordMock,
  verifyPassword: verifyPasswordMock,
}));

vi.mock("@/server/email/get-transactional-email-sender", () => ({
  getTransactionalEmailSender: () => ({
    send: sendEmailMock,
  }),
}));

import { authOptions } from "@/lib/auth/config";
import { resetPassword } from "@/server/use-cases/auth/reset-password";
import { sendPasswordReset } from "@/server/use-cases/auth/send-password-reset";

describe("password reset as buyer activation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    transactionMock.mockImplementation(async (callback: (tx: object) => unknown) =>
      callback({}),
    );
    generatePlaintextTokenMock.mockReturnValue("plain-reset-token");
    hashTokenMock.mockReturnValue("hashed-reset-token");
    getPasswordResetTokenExpiryDateMock.mockReturnValue(
      new Date("2026-05-30T15:00:00.000Z"),
    );
    hashPasswordMock.mockResolvedValue("hashed-new-password");
    verifyPasswordMock.mockResolvedValue(true);
    sendEmailMock.mockResolvedValue({
      ok: true,
      provider: "console",
      messageId: "message-1",
    });
  });

  it("allows an active buyer user without password to request a reset link", async () => {
    findUserByEmailForPasswordResetMock.mockResolvedValue({
      id: "user-1",
      name: null,
      email: "buyer@example.com",
      isActive: true,
      emailVerifiedAt: null,
    });

    const result = await sendPasswordReset({
      email: " BUYER@example.com ",
      origin: "https://atelier.example",
    });

    expect(invalidateAuthTokensByUserIdAndTypeMock).toHaveBeenCalledWith(
      "user-1",
      AuthTokenType.PASSWORD_RESET,
      {},
    );
    expect(createAuthTokenMock).toHaveBeenCalledWith(
      {
        userId: "user-1",
        type: AuthTokenType.PASSWORD_RESET,
        tokenHash: "hashed-reset-token",
        expiresAt: new Date("2026-05-30T15:00:00.000Z"),
      },
      {},
    );
    expect(sendEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "buyer@example.com",
        text: expect.stringContaining(
          "https://atelier.example/restablecer-contrasena?token=plain-reset-token",
        ),
      }),
    );
    expect(result.success).toBe(true);
  });

  it("sets passwordHash and verifies email when the reset belongs to an unverified buyer", async () => {
    findAuthTokenByHashAndTypeMock.mockResolvedValue({
      id: "token-1",
      userId: "user-1",
      type: AuthTokenType.PASSWORD_RESET,
      expiresAt: new Date(Date.now() + 60_000),
      consumedAt: null,
      user: {
        id: "user-1",
        isActive: true,
        emailVerifiedAt: null,
      },
    });
    consumeAuthTokenByIdMock.mockResolvedValue({ count: 1 });

    const result = await resetPassword({
      token: "plain-reset-token",
      password: "new-password",
      confirmPassword: "new-password",
    });

    expect(hashPasswordMock).toHaveBeenCalledWith("new-password");
    expect(updateUserPasswordMock).toHaveBeenCalledWith(
      {
        id: "user-1",
        passwordHash: "hashed-new-password",
        verifyEmail: true,
      },
      {},
    );
    expect(invalidateAuthTokensByUserIdAndTypeMock).toHaveBeenCalledWith(
      "user-1",
      AuthTokenType.PASSWORD_RESET,
      {},
    );
    expect(result).toEqual({
      success: true,
      status: 200,
      message: "Tu contrasena fue actualizada correctamente. Ya puedes iniciar sesion.",
      data: null,
    });
  });

  it("allows the buyer to log in once a password hash exists", async () => {
    userFindUniqueMock.mockResolvedValue({
      id: "user-1",
      email: "buyer@example.com",
      name: null,
      role: UserRole.STUDENT,
      isActive: true,
      passwordHash: "hashed-new-password",
      emailVerifiedAt: new Date("2026-05-30T14:00:00.000Z"),
    });

    const credentialsProvider = authOptions.providers.find(
      (provider) => provider.id === "credentials",
    );
    const authorize =
      typeof credentialsProvider === "object" &&
      credentialsProvider !== null &&
      "options" in credentialsProvider &&
      typeof credentialsProvider.options === "object" &&
      credentialsProvider.options !== null &&
      "authorize" in credentialsProvider.options &&
      typeof credentialsProvider.options.authorize === "function"
        ? credentialsProvider.options.authorize
        : null;

    expect(authorize).not.toBeNull();

    const result = await authorize?.({
      email: "buyer@example.com",
      password: "new-password",
    }, {
      headers: {
        "x-forwarded-for": "203.0.113.10",
        "user-agent": "vitest",
      },
    });

    expect(userFindUniqueMock).toHaveBeenCalledWith({
      where: {
        email: "buyer@example.com",
      },
    });
    expect(verifyPasswordMock).toHaveBeenCalledWith(
      "new-password",
      "hashed-new-password",
    );
    expect(result).toEqual({
      id: "user-1",
      email: "buyer@example.com",
      name: null,
      role: UserRole.STUDENT,
    });
  });
});
