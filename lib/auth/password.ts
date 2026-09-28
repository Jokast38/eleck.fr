import "server-only";
import { hash, verify } from "@node-rs/argon2";

// Argon2id, paramètres recommandés OWASP (19 Mio, 2 itérations)
const opts = { memoryCost: 19456, timeCost: 2, parallelism: 1 };

export const hashPassword = (plain: string) => hash(plain, opts);

export async function verifyPassword(hashed: string, plain: string) {
  try {
    return await verify(hashed, plain);
  } catch {
    return false;
  }
}

/** Hachage factice : même temps de calcul quand l'e-mail n'existe pas (évite l'énumération des comptes). */
let dummy: Promise<string> | null = null;
export async function dummyVerify(plain: string) {
  dummy ??= hash("mot-de-passe-factice-eleck", opts);
  return verifyPassword(await dummy, plain);
}

/** Règle de robustesse : 12 caractères minimum, avec lettres et chiffres. */
export function passwordProblem(p: string) {
  if (p.length < 12) return "12 caractères minimum.";
  if (!/[a-zA-Z]/.test(p) || !/\d/.test(p)) return "Le mot de passe doit contenir des lettres et des chiffres.";
  return null;
}
