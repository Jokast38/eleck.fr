import "server-only";
import { db } from "@/lib/db";
import { decrypt, encrypt } from "@/lib/crypto";
import { logActivity } from "@/lib/activity";
import { dummyVerify, verifyPassword } from "./password";
import { verifyTotp } from "./totp";

const MAX_FAILED = 5;
const LOCK_MINUTES = 15;

export type LoginCheck =
  | { ok: true; userId: string }
  | { ok: false; reason: "invalid" | "locked" | "totp_required" | "totp_invalid" | "inactive"; lockedUntil?: Date; pending?: string };

/**
 * Vérifie identifiants + code TOTP, avec verrouillage du compte après 5 échecs (15 minutes).
 * Seul point de vérification des identifiants de l'application.
 */
export async function checkLogin(emailRaw: string, password: string, code: string | undefined, ip: string, pending?: string): Promise<LoginCheck> {
  const email = emailRaw.trim().toLowerCase();
  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    await dummyVerify(password);
    return { ok: false, reason: "invalid" };
  }
  if (!user.active) return { ok: false, reason: "inactive" };
  if (user.lockedUntil && user.lockedUntil > new Date()) return { ok: false, reason: "locked", lockedUntil: user.lockedUntil };

  const fail = async (reason: "invalid" | "totp_invalid") => {
    const failed = user.failedLogins + 1;
    const lock = failed >= MAX_FAILED;
    const lockedUntil = lock ? new Date(Date.now() + LOCK_MINUTES * 60_000) : null;
    await db.user.update({ where: { id: user.id }, data: { failedLogins: lock ? 0 : failed, lockedUntil } });
    await logActivity({ userId: user.id, action: lock ? "user.locked" : "user.login_failed", entityType: "user", entityId: user.id, ip, details: { reason } });
    return lock ? ({ ok: false, reason: "locked", lockedUntil: lockedUntil! } as const) : ({ ok: false, reason } as const);
  };

  // Étape 2 (code 2FA) : le mot de passe a déjà été vérifié, attesté par un jeton chiffré de 5 minutes
  const pendingOk = pending ? readTicket(pending, "pw") === user.id : false;
  if (!pendingOk && !(await verifyPassword(user.passwordHash, password))) return fail("invalid");

  if (user.totpEnabled && user.totpSecret) {
    if (!code) return { ok: false, reason: "totp_required", pending: createTicket(user.id, "pw", 5 * 60_000) };
    if (!(await verifyTotp(decrypt(user.totpSecret), code.replace(/\s/g, ""))))
      return { ...(await fail("totp_invalid")), pending: createTicket(user.id, "pw", 5 * 60_000) };
  }

  await db.user.update({ where: { id: user.id }, data: { failedLogins: 0, lockedUntil: null, lastLoginAt: new Date() } });
  await logActivity({ userId: user.id, action: "user.login", entityType: "user", entityId: user.id, ip });
  return { ok: true, userId: user.id };
}

/** Jetons courts chiffrés (AUTH_SECRET) : « pw » = mot de passe vérifié, « login » = connexion validée. */
function createTicket(userId: string, stage: "pw" | "login", ttl: number) {
  return encrypt(JSON.stringify({ userId, stage, exp: Date.now() + ttl }));
}

function readTicket(ticket: string, stage: "pw" | "login") {
  try {
    const t = JSON.parse(decrypt(ticket)) as { userId: string; stage: string; exp: number };
    return t.stage === stage && t.exp > Date.now() ? t.userId : null;
  } catch {
    return null;
  }
}

/** Jeton de 60 s transmis à Auth.js après une vérification complète réussie. */
export const createLoginTicket = (userId: string) => createTicket(userId, "login", 60_000);
export const readLoginTicket = (ticket: string) => readTicket(ticket, "login");
