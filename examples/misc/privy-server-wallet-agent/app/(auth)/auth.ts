import { compare } from "bcrypt-ts";
import NextAuth, { type Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getUser } from "@/lib/db/queries";

import { authConfig } from "./auth.config";
import type { User } from "@/lib/db/schema";

export interface ExtendedSession extends Session {
  user: User;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        const users = await getUser(email);
        if (users.length === 0) return null;
        // biome-ignore lint: Forbidden non-null assertion.
        const passwordsMatch = await compare(password, users[0].password!);
        if (!passwordsMatch) return null;
        return users[0];
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-expect-error - next-auth session types extend the returned user type from Credentials
        token.walletId = user.walletId;
      }

      return token;
    },
    // @ts-expect-error - next-auth session types extend the returned user type from Credentials
    async session({
      session,
      user,
      token,
    }: {
      session: ExtendedSession;
      user: User;
      token: any;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.walletId = token.walletId;
      }

      return session;
    },
  },
});
