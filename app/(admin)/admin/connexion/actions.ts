"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { checkLogin, createLoginTicket } from "@/lib/auth/login";
import { loginLimiter } from "@/lib/security/ratelimit";
import { clientIp } from "@/lib/security/request";

export type LoginState = { step: "credentials" | "totp"; error?: string; email?: string; pending?: string };

/** Connexion au dashboard : identifiants, puis code 2FA si activé. */
export async function loginAction(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").slice(0, 200);
  const password = String(form.get("password") ?? "").slice(0, 200);
  const code = String(form.get("code") ?? "").trim() || undefined;
  const retour = String(form.get("retour") ?? "");
  const pending = String(form.get("pending") ?? "") || undefined;
  const ip = await clientIp();

  if (!(await loginLimiter().limit(ip)).success)
    return { step: "credentials", email, error: "Trop de tentatives. Réessayez dans quelques minutes." };

  const res = await checkLogin(email, password, code, ip, pending);
  if (!res.ok) {
    switch (res.reason) {
      case "totp_required":
        return { step: "totp", email, pending: res.pending };
      case "totp_invalid":
        return res.pending ? { step: "totp", email, pending: res.pending, error: "Code de vérification incorrect." } : { step: "credentials", email, error: "Code incorrect." };
      case "locked":
        return {
          step: "credentials",
          email,
          error: `Compte temporairement verrouillé après plusieurs échecs. Réessayez après ${res.lockedUntil?.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" })}.`,
        };
      default:
        return { step: "credentials", email, error: "E-mail ou mot de passe incorrect." };
    }
  }

  // Redirection interne uniquement (pas de redirection ouverte vers un autre site)
  const redirectTo = retour.startsWith("/admin") && !retour.startsWith("//") ? retour : "/admin";
  try {
    await signIn("credentials", { ticket: createLoginTicket(res.userId), redirectTo });
  } catch (e) {
    if (e instanceof AuthError) return { step: "credentials", email, error: "Connexion impossible. Réessayez." };
    throw e; // la redirection de succès passe par une exception interne de Next.js
  }
  return { step: "credentials" };
}
