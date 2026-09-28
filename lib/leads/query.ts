import "server-only";
import type { ClientType, LeadStatus, Prisma } from "@prisma/client";
import { statusOrder } from "./format";

export type LeadFilters = { q?: string; statut?: string; profil?: string; service?: string; ville?: string; tri?: string; ordre?: string; page?: string };

const sortable = { date: "createdAt", nom: "lastName", ville: "city", statut: "status", relance: "followUpAt" } as const;

/** Traduit les filtres de l'URL en requête Prisma (liste et export CSV partagent la même logique). */
export function leadQuery(f: LeadFilters) {
  const where: Prisma.LeadWhereInput = {};
  if (f.statut && statusOrder.includes(f.statut as LeadStatus)) where.status = f.statut as LeadStatus;
  if (f.profil && ["PARTICULIER", "COPROPRIETE", "ENTREPRISE"].includes(f.profil)) where.clientType = f.profil as ClientType;
  if (f.service && ["BORNE", "LED", "ELECTRICITE", "THERMOGRAPHIE"].includes(f.service)) where.service = f.service;
  if (f.ville) where.city = { contains: f.ville.trim(), mode: "insensitive" };
  const q = f.q?.trim();
  if (q) {
    const num = Number(q.replace(/^DEV-?/i, ""));
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q } },
      { companyName: { contains: q, mode: "insensitive" } },
      { postalCode: { startsWith: q } },
      ...(Number.isInteger(num) && num > 0 ? [{ number: num }] : []),
    ];
  }
  const field = sortable[(f.tri ?? "date") as keyof typeof sortable] ?? "createdAt";
  const dir: Prisma.SortOrder = f.ordre === "asc" ? "asc" : "desc";
  const orderBy: Prisma.LeadOrderByWithRelationInput = field === "followUpAt" ? { followUpAt: { sort: dir, nulls: "last" } } : { [field]: dir };
  return { where, orderBy };
}
