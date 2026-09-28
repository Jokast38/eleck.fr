import "server-only";
import { PrismaClient } from "@prisma/client";

/**
 * Adresse de la base : DATABASE_URL, sinon les variables créées par l'intégration Prisma Postgres de Vercel
 * (préfixe personnalisable, ex. DATABASE_PRISMA_DATABASE_URL). Seules les adresses directes postgres:// sont retenues.
 */
function databaseUrl() {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.DATABASE_PRISMA_DATABASE_URL,
    process.env.DATABASE_POSTGRES_URL,
    process.env.POSTGRES_URL,
  ];
  return candidates.find((u) => u && /^postgres(ql)?:\/\//.test(u.trim()))?.trim();
}

// Singleton : évite d'ouvrir une nouvelle connexion à chaque rechargement à chaud en développement
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const url = databaseUrl();
export const db = globalForPrisma.prisma ?? new PrismaClient(url ? { datasourceUrl: url } : undefined);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

/** true si une base est configurée (permet au site public de fonctionner sans base, avec son contenu par défaut). */
export const hasDatabase = () => Boolean(url);
