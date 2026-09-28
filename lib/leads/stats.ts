import "server-only";
import { db } from "@/lib/db";

const DAY = 864e5;

/** Indicateurs du tableau de bord. Les volumes d'une PME permettent d'agréger en mémoire. */
export async function dashboardStats() {
  const now = Date.now();
  const d7 = new Date(now - 7 * DAY);
  const d30 = new Date(now - 30 * DAY);
  const d90 = new Date(now - 90 * DAY);
  const weeksStart = startOfWeek(new Date(now - 11 * 7 * DAY));

  const [new7, new30, cohort30, quotes30, won30, leads90, since] = await Promise.all([
    db.lead.count({ where: { createdAt: { gte: d7 } } }),
    db.lead.count({ where: { createdAt: { gte: d30 } } }),
    db.lead.findMany({ where: { createdAt: { gte: d30 } }, select: { createdAt: true, firstResponseAt: true } }),
    db.lead.count({ where: { quoteSentAt: { gte: d30 } } }),
    db.lead.count({ where: { status: "GAGNE", closedAt: { gte: d30 } } }),
    db.lead.findMany({ where: { createdAt: { gte: d90 } }, select: { status: true, clientType: true, source: true, service: true } }),
    db.lead.findMany({ where: { createdAt: { gte: weeksStart } }, select: { createdAt: true } }),
  ]);

  const responded = cohort30.filter((l) => l.firstResponseAt);
  const responseRate = cohort30.length ? responded.length / cohort30.length : null;
  const avgResponseHours = responded.length
    ? responded.reduce((s, l) => s + (l.firstResponseAt!.getTime() - l.createdAt.getTime()), 0) / responded.length / 36e5
    : null;
  const conversion90 = leads90.length ? leads90.filter((l) => l.status === "GAGNE").length / leads90.length : null;

  // Demandes par semaine (12 semaines, du lundi au dimanche)
  const weeks = Array.from({ length: 12 }, (_, i) => {
    const start = new Date(weeksStart.getTime() + i * 7 * DAY);
    return { start, count: 0 };
  });
  for (const l of since) {
    const idx = Math.floor((startOfWeek(l.createdAt).getTime() - weeksStart.getTime()) / (7 * DAY));
    if (weeks[idx]) weeks[idx].count++;
  }

  const countBy = <K extends string>(key: (l: (typeof leads90)[number]) => K) => {
    const m = new Map<K, number>();
    for (const l of leads90) m.set(key(l), (m.get(key(l)) ?? 0) + 1);
    return m;
  };

  return {
    new7,
    new30,
    responseRate,
    avgResponseHours,
    quotes30,
    won30,
    conversion90,
    total90: leads90.length,
    weeks,
    byType: countBy((l) => l.clientType),
    bySource: countBy((l) => l.source),
    byService: countBy((l) => l.service),
  };
}

function startOfWeek(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = (x.getDay() + 6) % 7; // lundi = 0
  x.setDate(x.getDate() - day);
  return x;
}

/** Demandes à traiter en priorité : nouvelles non traitées, relances échues, visites imminentes. */
export async function priorityLeads() {
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  const in7 = new Date(Date.now() + 7 * DAY);
  const open = { notIn: ["GAGNE", "PERDU"] as ("GAGNE" | "PERDU")[] };
  const select = { id: true, number: true, firstName: true, lastName: true, city: true, clientType: true, status: true, createdAt: true, followUpAt: true, visitAt: true } as const;

  const [fresh, followUps, visits] = await Promise.all([
    db.lead.findMany({ where: { status: "NOUVEAU" }, orderBy: { createdAt: "asc" }, take: 8, select }),
    db.lead.findMany({ where: { status: open, followUpAt: { lte: endOfToday } }, orderBy: { followUpAt: "asc" }, take: 8, select }),
    db.lead.findMany({ where: { status: open, visitAt: { gte: new Date(), lte: in7 } }, orderBy: { visitAt: "asc" }, take: 8, select }),
  ]);
  return { fresh, followUps, visits };
}
