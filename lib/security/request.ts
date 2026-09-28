import "server-only";
import { headers } from "next/headers";

/** IP du client (derrière le proxy Vercel ou un reverse proxy). */
export async function clientIp() {
  const h = await headers();
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0.0.0.0";
}

/**
 * Protection CSRF des Route Handlers : refuse les requêtes modifiantes provenant d'une autre origine.
 * (Les Server Actions sont déjà protégées nativement par Next.js.)
 */
export function isSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
