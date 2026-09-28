"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { logActivity } from "@/lib/activity";
import { hashPassword, passwordProblem, verifyPassword } from "@/lib/auth/password";
import { decryptSecret, encryptSecret, newTotpSecret, totpQrDataUrl, verifyTotp } from "@/lib/auth/totp";

export type UserFormState = { ok?: boolean; error?: string; at?: number; qr?: string; secret?: string } | null;

/* ───────────── Gestion des utilisateurs (administrateurs) ───────────── */

const newUserSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(80),
  email: z.string().trim().toLowerCase().pipe(z.email("E-mail invalide")),
  role: z.enum(["ADMIN", "EMPLOYE"]),
  password: z.string(),
});

export async function createUser(_prev: UserFormState, form: FormData): Promise<UserFormState> {
  const admin = await requireUser({ role: "ADMIN" });
  const parsed = newUserSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message, at: Date.now() };
  const problem = passwordProblem(parsed.data.password);
  if (problem) return { error: `Mot de passe : ${problem}`, at: Date.now() };
  if (await db.user.findUnique({ where: { email: parsed.data.email } })) return { error: "Un compte existe déjà avec cet e-mail.", at: Date.now() };
  const user = await db.user.create({
    data: { name: parsed.data.name, email: parsed.data.email, role: parsed.data.role, passwordHash: await hashPassword(parsed.data.password) },
  });
  await logActivity({ userId: admin.id, action: "user.create", entityType: "user", entityId: user.id, details: { email: user.email, role: user.role } });
  revalidatePath("/admin/utilisateurs");
  return { ok: true, at: Date.now() };
}

export async function updateUser(form: FormData) {
  const admin = await requireUser({ role: "ADMIN" });
  const id = String(form.get("id"));
  const op = String(form.get("op"));
  if (id === admin.id && (op === "deactivate" || op === "role")) return; // on ne se retire pas ses propres droits
  const data =
    op === "deactivate" ? { active: false } :
    op === "activate" ? { active: true } :
    op === "unlock" ? { lockedUntil: null, failedLogins: 0 } :
    op === "reset2fa" ? { totpEnabled: false, totpSecret: null } :
    op === "role" ? { role: form.get("role") === "ADMIN" ? ("ADMIN" as const) : ("EMPLOYE" as const) } :
    null;
  if (!data) return;
  await db.user.update({ where: { id }, data });
  await logActivity({ userId: admin.id, action: "user.update", entityType: "user", entityId: id, details: { op } });
  revalidatePath("/admin/utilisateurs");
}

/* ───────────── Mon compte ───────────── */

export async function changePassword(_prev: UserFormState, form: FormData): Promise<UserFormState> {
  const me = await requireUser({ allowWithout2fa: true });
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  if (next !== String(form.get("confirm") ?? "")) return { error: "Les deux mots de passe ne correspondent pas.", at: Date.now() };
  const problem = passwordProblem(next);
  if (problem) return { error: problem, at: Date.now() };
  const user = await db.user.findUniqueOrThrow({ where: { id: me.id } });
  if (!(await verifyPassword(user.passwordHash, current))) return { error: "Mot de passe actuel incorrect.", at: Date.now() };
  await db.user.update({ where: { id: me.id }, data: { passwordHash: await hashPassword(next) } });
  await logActivity({ userId: me.id, action: "user.password", entityType: "user", entityId: me.id });
  return { ok: true, at: Date.now() };
}

/** Étape 1 de l'activation 2FA : génère un secret (stocké chiffré, pas encore actif) et le QR code. */
export async function start2fa(): Promise<UserFormState> {
  const me = await requireUser({ allowWithout2fa: true });
  if (me.totpEnabled) return { error: "La double authentification est déjà active.", at: Date.now() };
  const secret = newTotpSecret();
  await db.user.update({ where: { id: me.id }, data: { totpSecret: encryptSecret(secret), totpEnabled: false } });
  const { qr } = await totpQrDataUrl(secret, me.email);
  return { qr, secret, at: Date.now() };
}

/** Étape 2 : l'utilisateur saisit un code de son application pour confirmer. */
export async function confirm2fa(_prev: UserFormState, form: FormData): Promise<UserFormState> {
  const me = await requireUser({ allowWithout2fa: true });
  const user = await db.user.findUniqueOrThrow({ where: { id: me.id } });
  if (!user.totpSecret) return { error: "Relancez l'activation.", at: Date.now() };
  const ok = await verifyTotp(decryptSecret(user.totpSecret), String(form.get("code") ?? "").replace(/\s/g, ""));
  if (!ok) return { error: "Code incorrect. Vérifiez l'heure de votre téléphone et réessayez.", at: Date.now() };
  await db.user.update({ where: { id: me.id }, data: { totpEnabled: true } });
  await logActivity({ userId: me.id, action: "user.2fa_enabled", entityType: "user", entityId: me.id });
  revalidatePath("/admin/compte");
  return { ok: true, at: Date.now() };
}

export async function disable2fa(_prev: UserFormState, form: FormData): Promise<UserFormState> {
  const me = await requireUser({ allowWithout2fa: true });
  if (process.env.REQUIRE_2FA === "true") return { error: "La double authentification est obligatoire.", at: Date.now() };
  const user = await db.user.findUniqueOrThrow({ where: { id: me.id } });
  if (!user.totpSecret || !(await verifyTotp(decryptSecret(user.totpSecret), String(form.get("code") ?? "").replace(/\s/g, ""))))
    return { error: "Code incorrect.", at: Date.now() };
  await db.user.update({ where: { id: me.id }, data: { totpEnabled: false, totpSecret: null } });
  await logActivity({ userId: me.id, action: "user.2fa_disabled", entityType: "user", entityId: me.id });
  revalidatePath("/admin/compte");
  return { ok: true, at: Date.now() };
}
