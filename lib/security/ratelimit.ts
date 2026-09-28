import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type Limiter = { limit: (key: string) => Promise<{ success: boolean; reset: number }> };

/**
 * Limitation de débit par clé (IP…). Upstash Redis en production (partagé entre instances serverless),
 * repli en mémoire si Upstash n'est pas configuré (développement uniquement : non partagé entre instances).
 */
function memoryLimiter(max: number, windowMs: number): Limiter {
  const hits = new Map<string, number[]>();
  return {
    async limit(key) {
      const now = Date.now();
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      const success = recent.length < max;
      if (success) recent.push(now);
      hits.set(key, recent);
      return { success, reset: (recent[0] ?? now) + windowMs };
    },
  };
}

const limiters = new Map<string, Limiter>();

export function rateLimiter(name: string, max: number, window: `${number} ${"s" | "m" | "h"}`): Limiter {
  const id = `${name}:${max}:${window}`;
  const existing = limiters.get(id);
  if (existing) return existing;
  let limiter: Limiter;
  // Noms des variables selon l'intégration : Upstash direct (UPSTASH_REDIS_REST_*) ou Vercel Marketplace (KV_REST_API_*)
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (url && token) {
    limiter = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(max, window),
      prefix: `eleck:${name}`,
    });
  } else {
    const [n, unit] = window.split(" ");
    limiter = memoryLimiter(max, Number(n) * { s: 1e3, m: 6e4, h: 36e5 }[unit as "s" | "m" | "h"]);
  }
  limiters.set(id, limiter);
  return limiter;
}

/** 5 demandes de devis par heure et par IP (cahier des charges). */
export const leadLimiter = () => rateLimiter("lead", 5, "1 h");
/** 10 tentatives de connexion par 15 minutes et par IP (en plus du verrouillage par compte). */
export const loginLimiter = () => rateLimiter("login", 10, "15 m");
