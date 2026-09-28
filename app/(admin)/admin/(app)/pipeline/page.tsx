import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { clientTypeLabels, leadReference } from "@/lib/leads/format";
import { formatDate } from "@/lib/format";
import { serviceLabels, type ServiceKey } from "@/lib/content/services";
import { Kanban } from "@/components/admin/Kanban";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Pipeline" };

export default async function PipelinePage() {
  await requireUser();
  // Demandes en cours + demandes clôturées depuis moins de 60 jours
  const since = new Date(Date.now() - 60 * 864e5);
  const leads = await db.lead.findMany({
    where: { OR: [{ status: { notIn: ["GAGNE", "PERDU"] } }, { closedAt: { gte: since } }] },
    orderBy: [{ followUpAt: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }],
    take: 500,
    select: { id: true, number: true, firstName: true, lastName: true, companyName: true, city: true, clientType: true, service: true, status: true, followUpAt: true },
  });
  const now = new Date();

  return (
    <>
      <PageHeader title="Pipeline commercial" description="Glissez une carte pour changer son statut, ou utilisez le menu de la carte." />
      <Kanban
        leads={leads.map((l) => ({
          id: l.id,
          ref: leadReference(l.number),
          name: l.companyName ? `${l.companyName} (${l.firstName} ${l.lastName})` : `${l.firstName} ${l.lastName}`,
          city: l.city,
          type: `${serviceLabels[l.service as ServiceKey] ?? l.service} · ${clientTypeLabels[l.clientType]}`,
          status: l.status,
          followUp: l.followUpAt ? formatDate(l.followUpAt) : undefined,
          late: Boolean(l.followUpAt && l.followUpAt < now),
        }))}
      />
    </>
  );
}
