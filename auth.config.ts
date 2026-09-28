import type { NextAuthConfig } from "next-auth";

/**
 * Configuration Auth.js compatible Edge (utilisée par le middleware) : pas d'accès base ni de hachage ici.
 * Sessions JWT dans un cookie httpOnly, secure (en HTTPS) et sameSite=lax, gérés par Auth.js.
 */
export const authConfig = {
  pages: { signIn: "/admin/connexion" },
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 }, // 8 heures
  trustHost: true,
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as "ADMIN" | "EMPLOYE";
      return session;
    },
  },
} satisfies NextAuthConfig;
