import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export type CurrentUser = { id: string; email: string; name: string; role: "ADMIN" | "EMPLOYE"; totpEnabled: boolean };

/** Utilisateur connecté, relu en base à chaque requête (compte désactivé = accès coupé immédiatement). */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, role: true, active: true, totpEnabled: true },
  });
  if (!user?.active) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role, totpEnabled: user.totpEnabled };
});

/**
 * À appeler en tête de chaque page, action et route du dashboard.
 * `role: "ADMIN"` réserve l'accès aux administrateurs. Si REQUIRE_2FA=true, un compte sans 2FA est
 * redirigé vers la page « Mon compte » pour l'activer.
 */
export async function requireUser(opts: { role?: "ADMIN"; allowWithout2fa?: boolean } = {}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/connexion");
  if (process.env.REQUIRE_2FA === "true" && !user.totpEnabled && !opts.allowWithout2fa) redirect("/admin/compte?2fa=obligatoire");
  if (opts.role === "ADMIN" && user.role !== "ADMIN") redirect("/admin?acces=refuse");
  return user;
}

/** Variante pour les Route Handlers : null si non autorisé (la route renvoie alors 401/403). */
export async function apiUser(opts: { role?: "ADMIN" } = {}) {
  const user = await getCurrentUser();
  if (!user) return null;
  if (process.env.REQUIRE_2FA === "true" && !user.totpEnabled) return null;
  if (opts.role === "ADMIN" && user.role !== "ADMIN") return null;
  return user;
}
