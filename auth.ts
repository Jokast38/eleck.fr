import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { db } from "@/lib/db";
import { readLoginTicket } from "@/lib/auth/login";

/**
 * Auth.js (NextAuth v5). Les identifiants et le code TOTP sont vérifiés par l'action de connexion
 * (lib/auth/login.ts) ; le fournisseur ne fait qu'échanger le jeton court signé contre une session.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { ticket: {} },
      async authorize(credentials) {
        const userId = typeof credentials?.ticket === "string" ? readLoginTicket(credentials.ticket) : null;
        if (!userId) return null;
        const user = await db.user.findUnique({ where: { id: userId } });
        if (!user?.active) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
});
