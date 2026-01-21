import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Session, User } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import type { JWT } from "next-auth/jwt";
import { z } from "zod";

import { MOCK_USERS } from "@/lib/mock-data";
import { AppUser } from "./types/user";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type AuthUser = (User | AdapterUser) & {
  role?: string;
  merchantId?: string;
  memberRole?: "owner" | "staff" | "viewer";
};

export const { handlers, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: unknown): Promise<AppUser | null> {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const email = parsed.data.email.trim().toLowerCase();
        const password = parsed.data.password;
        const user = MOCK_USERS.find(
          (u) => u.email.trim().toLowerCase() === email,
        );

        if (!user) return null;
        if (password !== "password123") return null;
        if (user.status === "suspended") return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          merchantId: user.merchantId,
          memberRole: user.memberRole,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: AuthUser }) {
      const nextToken = token as JWT & {
        role?: string;
        merchantId?: string;
        memberRole?: "owner" | "staff" | "viewer";
      };
      if (user) {
        nextToken.role = user.role;
        nextToken.merchantId = user.merchantId;
        nextToken.memberRole = user.memberRole;
      }
      return nextToken;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT & {
        role?: string;
        merchantId?: string;
        memberRole?: "owner" | "staff" | "viewer";
      };
    }) {
      if (session.user) {
        const sessionUser = session.user as AuthUser;
        sessionUser.id = token.sub ?? sessionUser.id ?? "";
        sessionUser.role = token.role;
        sessionUser.merchantId = token.merchantId;
        sessionUser.memberRole = token.memberRole;
      }
      return session;
    },
  },
  secret:
    process.env.NEXTAUTH_SECRET ??
    (process.env.NODE_ENV === "production" ? undefined : "dev-secret"),
});
