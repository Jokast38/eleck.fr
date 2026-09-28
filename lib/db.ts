import "server-only";
import { PrismaClient } from "@prisma/client";

// Singleton : évite d'ouvrir une nouvelle connexion à chaque rechargement à chaud en développement
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

/** true si une base est configurée (permet au site public de fonctionner sans base, avec son contenu par défaut). */
export const hasDatabase = () => Boolean(process.env.DATABASE_URL);
