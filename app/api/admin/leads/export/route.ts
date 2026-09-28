import { db } from "@/lib/db";
import { apiUser } from "@/lib/auth/session";
import { logActivity } from "@/lib/activity";
import { leadQuery } from "@/lib/leads/query";
import { clientTypeLabels, leadReference, sourceLabels, statusLabels } from "@/lib/leads/format";
import { formatDateTime } from "@/lib/format";
import { serviceLabels, type ServiceKey } from "@/lib/content/services";

export const runtime = "nodejs";

/** Export CSV des demandes (mêmes filtres que la liste). Format Excel français : « ; » et BOM UTF-8. */
export async function GET(req: Request) {
  const user = await apiUser();
  if (!user) return new Response("Non authentifié", { status: 401 });

  const params = Object.fromEntries(new URL(req.url).searchParams);
  const { where, orderBy } = leadQuery(params);
  const leads = await db.lead.findMany({ where, orderBy, take: 10_000 });

  const cell = (v: unknown) => {
    let s = v == null ? "" : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // neutralise l'injection de formules dans Excel
    return `"${s.replace(/"/g, '""')}"`;
  };
  const head = [
    "Référence", "Date", "Statut", "Prestation", "Nature de la demande", "Profil", "Entreprise / résidence", "Prénom", "Nom", "E-mail", "Téléphone", "Code postal", "Ville",
    "Type de site", "Nombre de bornes", "Puissance", "Emplacement", "Distance tableau", "Véhicule", "Délai", "Message", "Provenance",
    "Relance", "Visite", "Première réponse", "Devis envoyé",
  ];
  const rows = leads.map((l) =>
    [
      leadReference(l.number), formatDateTime(l.createdAt), statusLabels[l.status], serviceLabels[l.service as ServiceKey] ?? l.service, l.need,
      clientTypeLabels[l.clientType], l.companyName,
      l.firstName, l.lastName, l.email, l.phone, l.postalCode, l.city, l.siteType, l.chargerCount, l.power, l.location, l.distance,
      l.vehicle, l.timeline, l.message, sourceLabels[l.source] ?? l.source, formatDateTime(l.followUpAt), formatDateTime(l.visitAt),
      formatDateTime(l.firstResponseAt), formatDateTime(l.quoteSentAt),
    ].map(cell).join(";"),
  );
  const csv = "﻿" + [head.map(cell).join(";"), ...rows].join("\r\n");

  await logActivity({ userId: user.id, action: "lead.export", details: { count: leads.length } });
  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="demandes-eleck-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
