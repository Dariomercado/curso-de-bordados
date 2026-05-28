import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import type { Adapter } from "next-auth/adapters";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { authSecret } from "@/lib/auth/secret";
import { loginInputSchema } from "@/lib/validations/login";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: authSecret,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Contraseña",
          type: "password",
        },
      },
      async authorize(credentials) {
        const parsed = loginInputSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: parsed.data.email,
          },
        });

        if (!user || !user.passwordHash || !user.isActive) {
          return null;
        }

        const isValidPassword = await verifyPassword(
          parsed.data.password,
          user.passwordHash,
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.uid = user.id;
        token.email = user.email ?? null;
        token.name = user.name ?? null;
        token.role =
          "role" in user && typeof user.role === "string"
            ? user.role
            : UserRole.STUDENT;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id =
          typeof token.uid === "string"
            ? token.uid
            : typeof token.sub === "string"
              ? token.sub
              : "";
        session.user.email =
          typeof token.email === "string" ? token.email : session.user.email ?? "";
        session.user.name =
          typeof token.name === "string" ? token.name : session.user.name ?? null;
        session.user.role =
          token.role === UserRole.ADMIN ? UserRole.ADMIN : UserRole.STUDENT;
      }

      return session;
    },
  },
};
