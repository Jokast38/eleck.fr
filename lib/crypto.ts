import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

/** Clé dérivée de AUTH_SECRET (jamais stockée en base). */
function key() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET manquant");
  return createHash("sha256").update(`eleck:enc:${secret}`).digest();
}

/** Chiffre une valeur sensible (ex. secret TOTP) en AES-256-GCM. Format : iv.tag.data (base64url). */
export function encrypt(plain: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map((b) => b.toString("base64url")).join(".");
}

export function decrypt(payload: string) {
  const [iv, tag, data] = payload.split(".").map((p) => Buffer.from(p, "base64url"));
  const decipher = createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}

/** Hachage de l'adresse IP (RGPD : l'IP n'est jamais conservée en clair). */
export function hashIp(ip: string) {
  return createHash("sha256").update(`eleck:ip:${process.env.AUTH_SECRET ?? ""}:${ip}`).digest("hex").slice(0, 32);
}
