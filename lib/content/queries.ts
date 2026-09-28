import "server-only";
import { db, hasDatabase } from "@/lib/db";
import { faq as defaultFaq, type FaqCategory, type FaqItem } from "./faq";
import type { Realisation } from "./realisations";
import { clientTypeLabels } from "@/lib/leads/format";
import { serviceLabels, type ServiceKey } from "./services";

/**
 * Contenus gérés depuis le dashboard, lus par le site public.
 * Sans base de données (ou en cas d'erreur), le site affiche le contenu par défaut du code.
 */
export async function getFaq(): Promise<FaqItem[]> {
  if (!hasDatabase()) return defaultFaq;
  try {
    const rows = await db.faqItem.findMany({ where: { published: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
    if (!rows.length) return defaultFaq;
    return rows.map((r) => ({ q: r.question, a: r.answer, category: r.category as FaqCategory, home: r.showOnHome }));
  } catch {
    return defaultFaq;
  }
}

/** Réalisations publiées, éventuellement limitées à une prestation (pages de service). */
export async function getPublishedRealisations(limit?: number, service?: ServiceKey): Promise<Realisation[]> {
  if (!hasDatabase()) return [];
  try {
    const rows = await db.realisation.findMany({
      where: { published: true, ...(service && { service }) },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      take: limit,
      include: { photos: { orderBy: { order: "asc" }, take: 1, select: { id: true, alt: true } } },
    });
    return rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      city: r.city,
      clientType: clientTypeLabels[r.clientType] as Realisation["clientType"],
      service: r.service as ServiceKey,
      serviceLabel: serviceLabels[r.service as ServiceKey] ?? r.service,
      description: r.description,
      image: r.photos[0]
        ? { src: `/api/files/${r.photos[0].id}`, alt: r.photos[0].alt ?? `${r.title} à ${r.city}`, width: 1200, height: 900 }
        : undefined,
    }));
  } catch {
    return [];
  }
}
