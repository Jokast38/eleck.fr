import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

/**
 * Protection du dashboard : toute page /admin (hors connexion) et toute API /api/admin exigent une session.
 * Les droits fins (rôle, compte actif, 2FA obligatoire) sont revérifiés côté serveur à chaque requête.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/connexion";

  if (!req.auth && !isLogin) {
    if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const url = new URL("/admin/connexion", req.nextUrl.origin);
    if (pathname !== "/admin") url.searchParams.set("retour", pathname);
    return NextResponse.redirect(url);
  }
  if (req.auth && isLogin) return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  return res;
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
