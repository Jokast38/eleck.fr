import "server-only";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity";

/**
 * Enregistre une réponse envoyée à un prospect : date de première réponse (KPI « délai moyen »)
 * et passage automatique du statut NOUVEAU → CONTACTÉ.
 */
export async function recordResponse(leadId: string, date: Date, userId?: string) {
  const lead = await db.lead.findUnique({ where: { id: leadId }, select: { status: true, firstResponseAt: true, createdAt: true } });
  if (!lead || date < lead.createdAt) return;
  const data: { firstResponseAt?: Date; status?: "CONTACTE" } = {};
  if (!lead.firstResponseAt) data.firstResponseAt = date;
  if (lead.status === "NOUVEAU") data.status = "CONTACTE";
  if (!Object.keys(data).length) return;
  await db.lead.update({ where: { id: leadId }, data });
  if (data.status)
    await logActivity({
      userId,
      action: "lead.status",
      entityType: "lead",
      entityId: leadId,
      details: { from: "NOUVEAU", to: "CONTACTE", auto: true },
    });
}
